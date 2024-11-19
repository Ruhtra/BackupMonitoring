import { IUseCase } from "backupmonitoring.shared/Interfaces/IUseCase";
import cron from "node-cron";
import path from "path";
import fs from "fs";

export class BackupUseCase implements IUseCase<void, void> {
  constructor() {
    const time = "12 15 * * *";
    console.log("configured to " + time);

    cron.schedule(time, async () => {
      console.log("Cron job triggered at 15:00");
      this.createFile();
    });
  }

  createFile() {
    const filePath = path.join("C:", "arquiv.txt"); // Define the file path
    const fileContent =
      "Backup triggered successfully at " + new Date().toLocaleString();

    // Write content to the file (will overwrite existing file)
    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log(`File successfully written to ${filePath}`);
      }
    });
  }

  async execute(): Promise<void> {
    console.log("execute");
  }
}
