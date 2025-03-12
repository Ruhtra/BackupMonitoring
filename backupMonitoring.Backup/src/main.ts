import { IUseCase } from "backupmonitoring.shared/src/Interfaces/IUseCase";
import cron, { ScheduledTask } from "node-cron"; // Import ScheduledTask para manipular o cron agendado
// import path from "path";
import fs from "fs";
import { IBackupService } from "./services/IBackupFirebirdService";
import { BackupFirebirdService } from "./services/BackupFirebirdService";
import { ISendService } from "./services/ISendService";
import { SendSftpService } from "./services/SendSftpService";
import axios from "axios";

interface SettingsConfig {
  backupFiles: string[];
  dayToKeep: number;
  backupCron: string;
  outputFolder: string;
  gbakFilePath: string;

  sendFile: boolean;
  pathRemote?: string;
  sftpUser?: string;
  sftpHost?: string;
  sftpPort?: string;
  sshKeyPath?: string;
}

const api = axios.create({
  baseURL: "http://server-api",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

export class BackupUseCase implements IUseCase<void, void> {
  private cronTask: ScheduledTask | null = null;
  private backupService: IBackupService;
  private sendService: ISendService;

  constructor(private settings: SettingsConfig) {
    this.backupService = new BackupFirebirdService(
      // this.settings.backupFiles,
      this.settings.outputFolder,
      this.settings.dayToKeep,
      this.settings.gbakFilePath
    );

    this.sendService = new SendSftpService(
      this.settings.outputFolder,
      this.settings.pathRemote!,
      this.settings.sftpUser!,
      this.settings.sftpHost!,
      this.settings.sftpPort!,
      this.settings.sshKeyPath!,
      this.settings.dayToKeep
    );
  }

  async reload(newSettings: SettingsConfig): Promise<void> {
    if (this.cronTask) {
      this.cronTask.stop();
      console.log("Previous cron job stopped.");
    }

    this.settings = newSettings;
    this.backupService = new BackupFirebirdService(
      // this.settings.backupFiles,
      this.settings.outputFolder,
      this.settings.dayToKeep,
      this.settings.gbakFilePath
    );
    this.sendService = new SendSftpService(
      this.settings.outputFolder,
      this.settings.pathRemote!,
      this.settings.sftpUser!,
      this.settings.sftpHost!,
      this.settings.sftpPort!,
      this.settings.sshKeyPath!,
      this.settings.dayToKeep
    );

    this.scheduleCronJob();
  }

  async execute(): Promise<void> {
    this.scheduleCronJob();
  }

  private scheduleCronJob() {
    const [seconds, minutes, hours] = this.settings.backupCron.split(" ");
    const timeString = `${hours}h ${minutes}m ${seconds}s`;
    console.log("configured to " + timeString);

    try {
      this.cronTask = cron.schedule(this.settings.backupCron, async () => {
        let reg;
        api
          .post("startBackup", {})
          .then((response) => {
            reg = response.data;
          })
          .catch((err) => console.log(err));

        // console.log(reg);

        // fazendo backup
        await this.backupService.MakeBackup({
          backupsFilePath: this.settings.backupFiles,
          onSuccess: async () => {
            api.post("backupSuccess", {}).catch((err) => console.log(err));
          },
          onFail: async () => {
            api.post("backupFail", {}).catch((err) => console.log(err));
          },
        });

        if (this.settings.sendFile) {
          const files = fs
            .readdirSync(this.settings.outputFolder)
            .filter((file) => file.endsWith(`.GBK`));

          //entity: incia envio
          //entity: salva o envio
          this.sendService.execute({
            fileNames: files,
            onSuccess: async () => {
              //entity: atualiza o processo
              //database: atualza o processo
            },
            onProgress: async () => {
              //entity: atualiza o processo
              //database: atualza o processo
            },
            onFail: async () => {
              //entity: atualiza o processo
              //database: atualza o processo
            },
          });
        }
      });
      console.log("Cron job scheduled successfully.");
    } catch (error) {
      console.error("Failed to schedule cron job:", error);
    } finally {
      //entity: finaliza processo
      //database: save processo
    }
  }
}
