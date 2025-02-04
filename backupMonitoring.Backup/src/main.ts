import { IUseCase } from "backupmonitoring.shared/src/Interfaces/IUseCase";
import cron, { ScheduledTask } from "node-cron"; // Import ScheduledTask para manipular o cron agendado
// import path from "path";
import fs from "fs";
import { IBackupService } from "./services/IBackupFirebirdService";
import { BackupFirebirdService } from "./services/BackupFirebirdService";
import { ISendService } from "./services/ISendService";
import { SendSftpService } from "./services/SendSftpService";

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
        // fazendo backup
        await this.backupService.MakeBackup({
          backupsFilePath: this.settings.backupFiles,
          onSuccess: async () => {},
          onFail: async () => {},
        });

        const files = fs
          .readdirSync(this.settings.outputFolder)
          .filter((file) => file.endsWith(`.GBK`));

        if (this.settings.sendFile) {
          this.sendService.execute({
            fileNames: files,
            onSuccess: async () => {},
            onProgress: async () => {},
            onFail: async () => {},
          });
        }
      });
      console.log("Cron job scheduled successfully.");
    } catch (error) {
      console.error("Failed to schedule cron job:", error);
    }
  }
}
