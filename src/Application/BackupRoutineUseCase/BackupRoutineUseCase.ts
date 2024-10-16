import { IBackupService } from "../../Domain/Services/IBackupService";
import { ISendService } from "../../Domain/Services/ISendService";
import { IUseCase } from "../IUseCase";
import cron from "node-cron";
import { IRegRepository } from "../../Domain/Repositories/IRegRepository";
import { RegEntity } from "../../Domain/Entities/RegEntity";
import { BackupRoutineInputDto } from "./BackupRouteDto";
import { formatDate } from "../../Infrastructure/Services/BackupFirebird/BackupFirebirdService";

export class BackupRoutineUseCase
  implements IUseCase<BackupRoutineInputDto, void>
{
  private lastUpdate: number = 0;
  constructor(
    private regRepository: IRegRepository,
    private backupService: IBackupService,
    private sendService: ISendService,
    private time: string,
    private DBS: string[]
  ) {
    this.validDbs();
  }

  private validDbs() {
    const uniqueDBS = new Set(this.DBS);
    if (uniqueDBS.size !== this.DBS.length) {
      throw new Error("There are repeated database names in the DBS list");
    }
  }

  async execute({ Notify }: BackupRoutineInputDto): Promise<void> {
    try {
      cron.schedule(this.time, async () => {
        await Promise.all(
          this.DBS.map(async (db) => {
            const reg = RegEntity.create({
              dbName: db,
            });

            await this.regRepository.Save(reg);
            Notify();

            reg.StartBackup();
            await this.regRepository.Update(reg);
            Notify();

            await this.backupService.MakeBackup({
              dbNames: [db],
              onSuccess: async (dbName) => {
                if (reg) {
                  reg.FinishBackup("success");
                  await this.regRepository.Update(reg);
                  Notify();
                }
              },
              onFail: async (dbName) => {
                if (reg) {
                  reg.FinishBackup("error");
                  await this.regRepository.Update(reg);
                  Notify();
                }
              },
            });

            reg.StartSend();
            await this.regRepository.Update(reg);
            Notify();

            await this.sendService.execute({
              fileNames: [reg.dbName + `_${formatDate(new Date())}.GBK`],
              onSuccess: async (dbName) => {
                if (reg) {
                  reg.FinishSend("success");
                  await this.regRepository.Update(reg);
                  Notify();
                }
              },
              onFail: async (dbName, error) => {
                if (reg) {
                  reg.FinishSend("error");
                  await this.regRepository.Update(reg);
                  Notify();
                }
              },
              onProgress: (dbName, percentage) => {
                const now = Date.now();
                if (now - this.lastUpdate >= 5000) {
                  // 5000 milissegundos = 5 segundos
                  console.log(percentage, " to ", dbName);
                  this.lastUpdate = now; // Atualiza o timestamp
                  Notify();
                }
              },
            });
          })
        );
      });
      console.log(`Schedule create to ${this.time}`);
    } catch (error) {
      console.error(`Erro durante o backup: ${error.message}`);
    }
  }
}
