// import { IBackupService } from "../../Domain/Services/IBackupService";
// import { ISendService } from "../../Domain/Services/ISendService";
// import { IUseCase } from "../IUseCase";
// import cron from "node-cron";
// import { IRegRepository } from "../../Domain/Repositories/IRegRepository";
// import { RegEntity } from "../../Domain/Entities/RegEntity";
// import { BackupRoutineInputDto } from "./BackupRouteDto";
// import { formatDateToString } from "../../Infrastructure/Utils";

// export class BackupRoutineUseCase
//   implements IUseCase<BackupRoutineInputDto, void>
// {
//   private lastUpdate: number = 0;
//   constructor(
//     private regRepository: IRegRepository,
//     private backupService: IBackupService,
//     private time: string,
//     private DBS: string[],
//     private sendService?: ISendService
//   ) {
//     this.validDbs();
//   }

//   private validDbs() {
//     const uniqueDBS = new Set(this.DBS);
//     if (uniqueDBS.size !== this.DBS.length) {
//       throw new Error("There are repeated database names in the DBS list");
//     }
//   }

//   async execute({ Notify }: BackupRoutineInputDto): Promise<void> {
//     try {
//       cron.schedule(this.time, async () => {
//         await Promise.all(
//           this.DBS.map(async (db) => {
//             let reg: RegEntity | null = null;

//             try {
//               reg = RegEntity.create({
//                 dbName: db,
//               });

//               reg.StartProcess();
//               await this.regRepository.Save(reg);
//               Notify();

//               reg.StartBackup();
//               await this.regRepository.Update(reg);
//               Notify();

//               await this.backupService.MakeBackup({
//                 dbNames: [db],
//                 onSuccess: async (dbName) => {
//                   if (reg) {
//                     reg.FinishBackup("success");
//                     await this.regRepository.Update(reg);
//                     Notify();
//                   }
//                 },
//                 onFail: async (dbName) => {
//                   if (reg) {
//                     reg.FinishBackup("error");
//                     await this.regRepository.Update(reg);
//                     Notify();
//                   }
//                 },
//               });

//               if (this.sendService) {
//                 reg.StartSend();
//                 await this.regRepository.Update(reg);
//                 Notify();

//                 await this.sendService.execute({
//                   fileNames: [
//                     reg.dbName + `_${formatDateToString(new Date())}.GBK`,
//                   ],
//                   onSuccess: async (dbName) => {
//                     if (reg) {
//                       reg.FinishSend("success");
//                       await this.regRepository.Update(reg);
//                       Notify();
//                     }
//                   },
//                   onFail: async (dbName, error) => {
//                     if (reg) {
//                       reg.FinishSend("error");
//                       await this.regRepository.Update(reg);
//                       Notify();
//                     }
//                   },
//                   onProgress: (dbName, percentage) => {
//                     const now = Date.now();
//                     if (now - this.lastUpdate >= 5000) {
//                       console.log(percentage, " to ", dbName);
//                       this.lastUpdate = now;
//                       Notify();
//                     }
//                   },
//                 });
//               }
//             } catch (error) {
//               console.log(
//                 `Erro durante o backup process para ${db}: ${error.message}`
//               );
//             } finally {
//               if (reg) {
//                 reg.FinishProcess();
//                 await this.regRepository.Update(reg);
//                 Notify();
//                 console.log(reg);
//               }
//             }
//           })
//         );
//       });
//       console.log(`Schedule created for ${this.time}`);
//     } catch (error) {
//       console.error(`Erro durante o agendamento do backup: ${error.message}`);
//     }
//   }
// }
