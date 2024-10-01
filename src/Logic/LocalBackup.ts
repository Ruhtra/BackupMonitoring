import path from "path";
import { FileSender } from "./Utils/SendFiles";
import { Gbak } from "./Utils/MakeBackup";

import cron from "node-cron"; // Import the node-cron package
import { IRegService } from "../Service/Interfaces/IRegService";
import { randomUUID } from "crypto";

const sourceDB = path.join("C:", "Dados");
const backupDB = path.join("C:", "bkp");
const sender = new FileSender(
  backupDB,
  "C:/BackupAntonio",
  "n3",
  "187.19.216.31",
  "2890"
);

export class LocalBackup {
  constructor(sendToClients: () => Promise<void>, RegService: IRegService) {
    const gbak = new Gbak(sourceDB, backupDB);

    const id = randomUUID();
    // Schedule the backup to run every day at 8 AM
    cron.schedule("28 12 * * *", async () => {
      try {
        //starting
        console.log("Iniciando o backup diário...");
        await RegService.save({
          id: id,
          createdAt: new Date(),
          name: "yes",
          status: "progress",
        });
        await sendToClients(); // Notify clients

        // Execute backup
        await gbak.makeBackup(["TESTE"]);

        // Send files after backup
        await sender.sendFiles();

        await RegService.update({
          id: id,
          createdAt: new Date(),
          name: "yes",
          status: "successs",
        });
        await sendToClients(); // Notify clients
        console.log("Backup e envio de arquivos concluídos com sucesso.");
      } catch (error) {
        await RegService.update({
          id: id,
          createdAt: new Date(),
          name: "yes",
          status: "error",
        });

        await sendToClients(); // Notify clients on error
        console.error(`Erro durante o backup: ${error.message}`);
      }
    });
  }
}
