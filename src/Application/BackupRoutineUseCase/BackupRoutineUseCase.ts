import { IBackupService } from "../../Domain/Services/IBackupService";
import { ISendService } from "../../Domain/Services/ISendService";
import { IUseCase } from "../IUseCase";
import cron from "node-cron";
import { IRegRepository } from "../../Domain/Repositories/IRegRepository";
import { RegEntity } from "../../Domain/Entities/RegEntity";
import { BackupRoutineInputDto } from "./BackupRouteDto";

const DBS = ["TESTE2", "TESTE"];

export class BackupRoutineUseCase
  implements IUseCase<BackupRoutineInputDto, void>
{
  time: string;
  constructor(
    private regRepository: IRegRepository,
    private backupService: IBackupService,
    private sendService: ISendService
  ) {
    this.time = " 15 07 11 * * *";
  }

  async execute({ Notify }: BackupRoutineInputDto): Promise<void> {
    try {
      cron.schedule(this.time, async () => {
        const regs = await Promise.all(
          DBS.map(async (db) => {
            const reg = RegEntity.create({
              dbName: db,
            });

            await this.regRepository.Save(reg);
            Notify();
            return reg;
          })
        );

        await Promise.all(
          regs.map(async (reg) => {
            reg.updateStatusBackup({
              statusBackup: "progress",
            });
            await this.regRepository.Update(reg);
            Notify();
          })
        );

        await this.backupService.MakeBackup({
          dbNames: DBS,
          onSuccess: async (dbName) => {
            const reg = regs.find((reg) => reg.dbName === dbName);
            if (reg) {
              reg.updateStatusBackup({
                statusBackup: "successs",
              });
              await this.regRepository.Update(reg);
              Notify();
            }
          },
          onFail: async (dbName) => {
            const reg = regs.find((reg) => reg.dbName === dbName);
            if (reg) {
              reg.updateStatusBackup({
                statusBackup: "error",
              });
              await this.regRepository.Update(reg);
              Notify();
            }
          },
        });

        await Promise.all(
          regs.map(async (reg) => {
            reg.updatestatusSend({
              statusSend: "progress",
            });
            await this.regRepository.Update(reg);
            Notify();
          })
        );
        await this.sendService.execute({
          onSuccess: async (dbName) => {
            const reg = regs.find((reg) => reg.dbName === dbName);
            if (reg) {
              reg.updatestatusSend({
                statusSend: "successs",
              });
              await this.regRepository.Update(reg);
              Notify();
            }
          },
          onFail: async (dbName, error) => {
            const reg = regs.find((reg) => reg.dbName === dbName);
            if (reg) {
              reg.updatestatusSend({
                statusSend: "error",
              });
              await this.regRepository.Update(reg);
              Notify();
            }
          },
        });
      });
      console.log(`Schedule create to ${this.time}`);
    } catch (error) {
      console.error(`Erro durante o backup: ${error.message}`);
    }
  }
}
