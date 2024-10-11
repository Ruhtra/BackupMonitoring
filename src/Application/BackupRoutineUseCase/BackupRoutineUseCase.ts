import { IBackupService } from "../../Domain/Services/IBackupService";
import { ISendService } from "../../Domain/Services/ISendService";
import { IUseCase } from "../IUseCase";
import cron from "node-cron";
import { IRegRepository } from "../../Domain/Repositories/IRegRepository";
import { RegEntity } from "../../Domain/Entities/RegEntity";
import { BackupRoutineInputDto } from "./BackupRouteDto";

const DBS = ["TESTE"];

export class BackupRoutineUseCase
  implements IUseCase<BackupRoutineInputDto, void>
{
  time: string;
  constructor(
    private regRepository: IRegRepository,
    private backupService: IBackupService,
    private sendService: ISendService
  ) {
    this.time = "10 22 14 * * *";
  }

  async execute({ Notify }: BackupRoutineInputDto): Promise<void> {
    try {
      cron.schedule(this.time, async () => {
        await Promise.all(
          DBS.map(async (db) => {
            const reg = RegEntity.create({
              dbName: db,
            });

            await this.regRepository.Save(reg);
            Notify();

            reg.updateStatusBackup({
              statusBackup: "progress",
            });
            await this.regRepository.Update(reg);
            Notify();

            await this.backupService.MakeBackup({
              dbNames: DBS,
              onSuccess: async (dbName) => {
                if (reg) {
                  reg.updateStatusBackup({
                    statusBackup: "success",
                  });
                  await this.regRepository.Update(reg);
                  Notify();
                }
              },
              onFail: async (dbName) => {
                if (reg) {
                  reg.updateStatusBackup({
                    statusBackup: "error",
                  });
                  await this.regRepository.Update(reg);
                  Notify();
                }
              },
            });

            reg.updatestatusSend({
              statusSend: "progress",
            });
            await this.regRepository.Update(reg);
            Notify();

            await this.sendService.execute({
              fileNames: [reg.dbName + "_01.GBK"],
              onSuccess: async (dbName) => {
                if (reg) {
                  reg.updatestatusSend({
                    statusSend: "success",
                  });
                  await this.regRepository.Update(reg);
                  Notify();
                }
              },
              onFail: async (dbName, error) => {
                if (reg) {
                  reg.updatestatusSend({
                    statusSend: "error",
                  });
                  await this.regRepository.Update(reg);
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
