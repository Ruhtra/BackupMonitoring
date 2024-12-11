import { IUseCase } from "backupmonitoring.shared/src/Interfaces/IUseCase";
import cron, { ScheduledTask } from "node-cron"; // Import ScheduledTask para manipular o cron agendado
import path from "path";
import fs from "fs";

export class BackupUseCase implements IUseCase<void, void> {
  private cronTask: ScheduledTask | null = null; // Armazenar a referência do cron job

  constructor(private triggedTime: string) {}

  createFile() {
    const now = new Date();
    const filePath = path.join(
      process.env.HOME || process.env.USERPROFILE || "C:/Temp",
      `arquiv-${now.getHours().toString().padStart(2, "0")}-${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );

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

  async reload(newTriggedTime: string): Promise<void> {
    console.log("Reloading cron job with new time:", newTriggedTime);

    // Cancelar o cron job atual se existir
    if (this.cronTask) {
      this.cronTask.stop(); // Para o cron job
      console.log("Previous cron job stopped.");
    }

    // Atualizar o triggedTime
    this.triggedTime = newTriggedTime;

    // Agendar o novo cron job
    this.scheduleCronJob();
  }

  async execute(): Promise<void> {
    this.scheduleCronJob(); // Chamar o método de agendamento na primeira execução
  }

  private scheduleCronJob() {
    const inHour = this.triggedTime.split(" ");

    const timeString = `${inHour[2]}h ${inHour[1]}m ${inHour[0]}s`;
    console.log("configured to " + timeString);

    try {
      // Agendar o cron job e salvar a referência para manipulação posterior
      this.cronTask = cron.schedule(this.triggedTime, async () => {
        console.log(`Cron job triggered at ${timeString}`);
        this.createFile();
      });
      console.log("Cron job scheduled successfully.");
    } catch (error) {
      console.error("Failed to schedule cron job:", error);
    }
  }
}
