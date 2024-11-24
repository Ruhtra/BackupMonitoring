import { IUseCase } from "backupmonitoring.shared/Interfaces/IUseCase";
import cron from "node-cron";
import path from "path";
import fs from "fs";

export class BackupUseCase implements IUseCase<void, void> {
  constructor() {
    const trigged_time = "00 12 15 * * *";
    const inHour = trigged_time.split(" ");
    const timeString = `${inHour[0]}:${inHour[1]}:${inHour[0]}`;
    console.log("configured to " + timeString);

    cron.schedule(trigged_time, async () => {
      console.log(`Cron job triggered at ${timeString}`);
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
