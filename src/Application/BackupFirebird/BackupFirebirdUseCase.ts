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

export class BackupFirebirdUseCase
  implements IUseCase<BackupFirebirdInputDto, void>
{
  constructor(private regRepository: IRegRepository) {}

  async exeute({ cb }: BackupFirebirdInputDto): Promise<void> {
    // Schedule the backup to run every day at 8 AM
    cron.schedule("15 14 * * *", async () => {
      const reg = RegEntity.create({
        status: "progress",
      });

      try {
        await this.regRepository.save(reg);
        await cb(); // Notify clients

        await gbak.makeBackup(["TESTE"]);
        await sender.sendFiles();

        console.log("Backup e envio de arquivos concluídos com sucesso.");
        reg.update({ status: "successs" });
      } catch (error) {
        console.error(`Erro durante o backup: ${error.message}`);
        reg.update({ status: "error" });
      } finally {
        await this.regRepository.update(reg);
        await cb(); // Notify clients
      }
    });
  }
}
