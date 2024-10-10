import path from "path";
import { IUseCase } from "../IUseCase";
import { Gbak } from "./Utils/MakeBackup";
import { FileSender } from "./Utils/SendFiles";
import cron from "node-cron";
import { IRegRepository } from "../../Domain/Repositories/Interfaces/IRegRepository";
import { RegEntity } from "../../Domain/Entities/RegEntity";
import { BackupFirebirdInputDto } from "./BackupFirebirdDto";

const sourceDB = path.join("C:", "Dados");
const backupDB = path.join("C:", "bkp");
const sender = new FileSender(
  backupDB,
  "C:/BackupAntonio",
  "n3",
  "187.19.216.31",
  "2890"
);
const gbak = new Gbak(sourceDB, backupDB);

const dbs = ["TESTE", "TESTE2"];

export class BackupFirebirdUseCase
  implements IUseCase<BackupFirebirdInputDto, void>
{
  constructor(private regRepository: IRegRepository) {}

  async exeute({ onUpdate }: BackupFirebirdInputDto): Promise<void> {
    // Schedule the backup to run every day at 8 AM
    cron.schedule("05 08 * * *", async () => {
      const regs: RegEntity[] = dbs.map((e) => {
        return RegEntity.create({
          status: "progress",
          dbName: e,
        });
      });
      try {
        await Promise.all(
          regs.map(async (reg) => await this.regRepository.save(reg))
        );
        await onUpdate();

        await gbak.makeBackup({
          databaseNames: dbs,

          onSuccess: async (dbName: string) => {
            const reg = regs.find((reg) => reg.dbName == dbName);
            reg.update({ status: "successs" });
            await this.regRepository.update(reg);
            onUpdate();
          },
          onFail: async (dbName: string) => {
            const reg = regs.find((reg) => reg.dbName == dbName);
            reg.update({ status: "error" });
            await this.regRepository.update(reg);
            onUpdate();
          },
        });

        await sender.sendFiles();
      } catch (error) {
        console.error(`Erro durante o backup: ${error.message}`);
      } finally {
        await Promise.all(
          regs.map(async (reg) => {
            await this.regRepository.update(reg);
          })
        );
        await onUpdate();
      }
    });
  }
}
