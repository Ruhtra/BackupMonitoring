import { IUseCase } from "backupmonitoring.shared/src/Interfaces/IUseCase";
import { regCreateUseCase } from "backupmonitoring.server/src/Application/RegUseCase/RegCreate";
import { regStartProccessUseCase } from "backupmonitoring.server/src/Application/RegUseCase/RegStartProccess";
import { regStartBackupUseCase } from "backupmonitoring.server/src/Application/RegUseCase/RegStartBackup";
import { regFinishBackupUseCase } from "backupmonitoring.server/src/Application/RegUseCase/RegFinishBackup";
import { regStartSendingUseCase } from "backupmonitoring.server/src/Application/RegUseCase/RegStartSending";
import { regFinishSendingUseCase } from "backupmonitoring.server/src/Application/RegUseCase/RegFinishSending";
import { regFinishProccessUseCase } from "backupmonitoring.server/src/Application/RegUseCase/RegFinishProccess";
import cron, { ScheduledTask } from "node-cron"; // Import ScheduledTask para manipular o cron agendado
// import path from "path";
import fs from "fs";
import { IBackupService } from "./services/IBackupFirebirdService";
import { BackupFirebirdService } from "./services/BackupFirebirdService";
import { ISendService } from "./services/ISendService";
import { SendSftpService } from "./services/SendSftpService";
import axios from "axios";
import path from "path";

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
  baseURL: "http://localhost:8080/webhook/",
  // baseURL: "http://n3solucoes.zapto.org:7405/webhook/",
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

    async function generateId(name: string): Promise<string> {
      const data = await regCreateUseCase.execute({
        dbName: name,
      });

      // const { data } = await api.post<{ id: string }>("create", {
      //   dbName: name,
      // });

      if (data) {
        return data.id;
      }
    }

    try {
      this.cronTask = cron.schedule(this.settings.backupCron, async () => {
        const backupFileObjects = await Promise.all(
          this.settings.backupFiles.map(async (file, index) => ({
            id: await generateId(path.basename(file, path.extname(file))),
            name: path.basename(file, path.extname(file)),
          }))
        );

        await Promise.all(
          backupFileObjects.map(
            (e) => regStartProccessUseCase.execute({ id: e.id })
            // api
            //   .post("startProccess", { id: e.id })
            // .catch((err) => console.log(err))
          )
        );

        await Promise.all(
          backupFileObjects.map(
            (e) => regStartBackupUseCase.execute({ id: e.id })
            // api
            //   .post("startBackup", { id: e.id })
            // .catch((err) => console.log(err))
          )
        );

        // fazendo backup
        await this.backupService.MakeBackup({
          backupsFilePath: this.settings.backupFiles,
          onSuccess: async (dbName) => {
            const fileNameWithoutExtension = path.basename(
              dbName,
              path.extname(dbName)
            );

            const backupFileObject = backupFileObjects.find(
              (obj) => obj.name === fileNameWithoutExtension
            );
            if (backupFileObject) {
              const { id } = backupFileObject;
              await regFinishBackupUseCase.execute({ id, status: "success" });
              // api
              //   .post("finishbackup", { id, status: "success" })
              // .catch((err) => console.log(err));
            } else {
              console.error(
                `Backup file object not found for database: ${fileNameWithoutExtension}`
              );
              // throw new Error(`Backup file object not found for database: ${dbName}`);
            }
          },
          onFail: async (dbName) => {
            const fileNameWithoutExtension = path.basename(
              dbName,
              path.extname(dbName)
            );

            const backupFileObject = backupFileObjects.find(
              (obj) => obj.name === fileNameWithoutExtension
            );
            if (backupFileObject) {
              const { id } = backupFileObject;

              await regFinishBackupUseCase.execute({ id, status: "fail" });
              // api
              //   .post("finishbackup", { id, status: "fail" })
              // .catch((err) => console.log(err));
            } else {
              console.error(
                `Backup file object not found for database: ${fileNameWithoutExtension}`
              );
              // throw new Error(`Backup file object not found for database: ${dbName}`);
            }
          },
        });

        if (this.settings.sendFile) {
          await Promise.all(
            backupFileObjects.map(
              (e) => regStartSendingUseCase.execute({ id: e.id })
              // api
              //   .post("startSending", { id: e.id })
              // .catch((err) => console.log(err))
            )
          );

          const files = fs
            .readdirSync(this.settings.outputFolder)
            .filter((file) => file.endsWith(`.GBK`));

          await this.sendService.execute({
            fileNames: files,
            onSuccess: async (dbName) => {
              const fileNameWithoutDate = dbName
                .split("_")
                .slice(0, -3)
                .join("_");

              const backupFileObject = backupFileObjects.find(
                (obj) => obj.name === fileNameWithoutDate
              );
              if (backupFileObject) {
                const { id } = backupFileObject;
                await regFinishSendingUseCase.execute({
                  id,
                  status: "success",
                });
                // api
                //   .post("finishSending", { id, status: "success" })
                // .catch((err) => console.log(err));
              } else {
                console.error(
                  `Backup file object not found for database: ${fileNameWithoutDate}`
                );
                // throw new Error(`Backup file object not found for database: ${dbName}`);
              }
            },
            onProgress: async () => {
              //entity: atualiza o processo
              //database: atualza o processo
            },
            onFail: async (dbName) => {
              const fileNameWithoutDate = dbName
                .split("_")
                .slice(0, -3)
                .join("_");

              const backupFileObject = backupFileObjects.find(
                (obj) => obj.name === fileNameWithoutDate
              );
              if (backupFileObject) {
                const { id } = backupFileObject;
                await regFinishSendingUseCase.execute({ id, status: "fail" });
                // api
                //   .post("finishSending", { id, status: "fail" })
                // .catch((err) => console.log(err));
              } else {
                console.error(
                  `Backup file object not found for database: ${fileNameWithoutDate}`
                );
                // throw new Error(`Backup file object not found for database: ${dbName}`);
              }
            },
          });
        }

        await Promise.all(
          backupFileObjects.map(
            (e) => regFinishProccessUseCase.execute({ id: e.id })
            // api
            //   .post("finishProccess", {
            //     id: e.id,
            //   })
            // .catch((err) => console.log(err))
          )
        );
      });
      console.log("Cron job scheduled successfully.");
    } catch (error) {
      console.error("Failed to schedule cron job:", error);
    }
  }
}
