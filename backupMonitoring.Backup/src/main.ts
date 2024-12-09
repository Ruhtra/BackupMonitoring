import { IUseCase } from "backupmonitoring.shared/src/Interfaces/IUseCase";
import cron from "node-cron";
import path from "path";
import fs from "fs";

export class BackupUseCase implements IUseCase<void, void> {
  constructor(triggedTime: string) {
    const trigged_time = triggedTime;
    const inHour = trigged_time.split(" ");

    console.log(triggedTime);

    const timeString = `${inHour[2]}h ${inHour[1]}m ${inHour[0]}s`;
    console.log("configured to " + timeString);

    cron.schedule(trigged_time, async () => {
      console.log(`Cron job triggered at ${timeString}`);
      this.createFile();
    });
  }

  createFile() {
    const now = new Date();
    const filePath = path.join(
      "C:",
      `arquiv-${now.getHours().toString().padStart(2, "0")}-${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    ); // Define the file path
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
