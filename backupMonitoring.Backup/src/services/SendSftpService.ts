import SftpClient from "ssh2-sftp-client"; // Importando o cliente SFTP
import * as fs from "fs";
import { ISendService, SendOptions } from "./ISendService";
import path from "path";
import { extractDateFromFileName } from "../utils";

export class SendSftpService implements ISendService {
  private localPath: string;
  private remotePath: string;
  private user: string;
  private address: string;
  private port: string;
  private privateKey: string;
  private daysToKeep: number;

  constructor(
    localPath: string,
    remotePath: string,
    user: string,
    address: string,
    port: string,
    privateKey: string,
    daysToKeep: number
  ) {
    this.localPath = localPath;
    this.remotePath = remotePath;
    this.user = user;
    this.address = address;
    this.port = port;
    this.privateKey = privateKey;
    this.daysToKeep = daysToKeep;
  }

  async execute(options: SendOptions): Promise<void> {
    const { fileNames, onSuccess, onProgress, onFail } = options;

    const sftp = new SftpClient();
    let isConnected = false;

    try {
      await sftp.connect({
        host: this.address,
        port: Number(this.port),
        username: this.user,
        privateKey: fs.readFileSync(this.privateKey),
      });
      isConnected = true;

      for (const fileName of fileNames) {
        const filePath = path.join(this.localPath, fileName);

        if (!fs.existsSync(filePath)) {
          await onFail(fileName, new Error(`File ${fileName} not found`));
          continue;
        }

        await sftp.fastPut(filePath, path.join(this.remotePath, fileName), {
          step(totalTransferred, _chunk, total) {
            const percentage = ((totalTransferred / total) * 100).toFixed(2);
            onProgress(fileName, percentage);
          },
        });

        await onSuccess(fileName);
      }

      await this.cleanupOldBackups(sftp);
    } catch (error) {
      if (error instanceof Error) {
        for (const fileName of fileNames) {
          await onFail(fileName, error);
        }
      } else {
        for (const fileName of fileNames) {
          await onFail(fileName, new Error("Erro desconhecido no envio "));
        }
      }
    } finally {
      if (isConnected) {
        // await sftp.end()
        // await sftp.end();
      }
    }
  }

  // Método para limpar backups antigos no servidor
  private async cleanupOldBackups(sftp: SftpClient): Promise<void> {
    const files = await sftp.list(this.remotePath);
    const backupFiles = files.filter((file) => file.name.endsWith(".GBK"));

    for (const file of backupFiles) {
      const fileDate = extractDateFromFileName(file.name).getTime();
      const currentDate = new Date();
      const retentionLimit = new Date();
      retentionLimit.setDate(currentDate.getDate() - this.daysToKeep);

      if (fileDate < retentionLimit.getTime()) {
        await sftp.delete(`${this.remotePath}/${file.name}`);
        console.log(`Deleted old backup: ${file.name}`);
      }
    }
  }
}
