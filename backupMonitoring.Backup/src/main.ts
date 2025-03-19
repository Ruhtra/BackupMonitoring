import { IUseCase } from "backupmonitoring.shared/src/Interfaces/IUseCase";
import cron, { ScheduledTask } from "node-cron"; // Import ScheduledTask para manipular o cron agendado
// import path from "path";
import { IBackupService } from "./services/IBackupFirebirdService";
import { BackupFirebirdService } from "./services/BackupFirebirdService";
import { ISendService } from "./services/ISendService";
import { SendSftpService } from "./services/SendSftpService";
import axios from "axios";
import path from "path";
import { getLatestFileByPrefix } from "./utils";

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
  baseURL: "http://n3solucoes.zapto.org:7405/webhook/",
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

    async function generateId(name: string): Promise<string | undefined> {
      const { data } = await api.post<{ id: string }>("create", {
        dbName: name,
      });

      if (data) {
        return data.id;
      }
    }

    try {
      this.cronTask = cron.schedule(this.settings.backupCron, async () => {
        const backupFileObjects = await Promise.all(
          this.settings.backupFiles.map(async (file) => ({
            id: await generateId(path.basename(file, path.extname(file))),
            name: path.basename(file, path.extname(file)),
            path: file,
          }))
        );

        await Promise.all(
          backupFileObjects.map(async (e) => {
            try {
              await api.post("startProccess", { id: e.id }).catch(() => {});
              await api.post("startBackup", { id: e.id }).catch(() => {});

              await this.backupService.MakeBackup({
                backupsFilePath: [e.path],
                onSuccess: async () => {
                  await api
                    .post("finishbackup", {
                      id: e.id,
                      status: "success",
                    })
                    .catch(() => {});
                },
                onFail: async () => {
                  await api
                    .post("finishbackup", {
                      id: e.id,
                      status: "fail",
                    })
                    .catch(() => {});
                },
              });

              if (this.settings.sendFile) {
                await api.post("startSending", { id: e.id }).catch(() => {});

                const file = getLatestFileByPrefix(
                  e.name,
                  this.settings.outputFolder
                );
                if (!file) throw new Error("File not found");

                await this.sendService.execute({
                  fileNames: [file],
                  onSuccess: async () => {
                    await api
                      .post("finishSending", {
                        id: e.id,
                        status: "success",
                      })
                      .catch(() => {});
                  },
                  onProgress: async () => {
                    //entity: atualiza o processo
                    //database: atualza o processo
                  },
                  onFail: async () => {
                    await api
                      .post("finishSending", {
                        id: e.id,
                        status: "fail",
                      })
                      .catch(() => {});
                  },
                });

                await api
                  .post("finishProccess", {
                    id: e.id,
                  })
                  .catch(() => {});
              }
            } catch (error) {
              console.error(`Error processing ID: ${e.id}`, error);
            }
          })
        );
      });
      console.log("Cron job scheduled successfully.");
    } catch (error) {
      console.error("Failed to schedule cron job:", error);
    }
  }
}
