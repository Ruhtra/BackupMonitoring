import { Client as ScpClient } from "node-scp";
import SftpClient from "ssh2-sftp-client"; // Importando o cliente SFTP
import * as fs from "fs";
import {
  ISendService,
  SendOptions,
} from "../../../Domain/Services/ISendService";
import path from "path";

export class SendScpService implements ISendService {
  localPath: string;
  remotePath: string;
  user: string;
  address: string;
  port: string;
  privateKey: string;

  constructor(
    localPath: string,
    remotePath: string,
    user: string,
    address: string,
    port: string,
    privateKey: string
  ) {
    this.localPath = localPath;
    this.remotePath = remotePath;
    this.user = user;
    this.address = address;
    this.port = port;
    this.privateKey = privateKey;
  }

  async execute(options: SendOptions): Promise<void> {
    const { fileNames, onSuccess, onProgress, onFail } = options;

    try {
      const client = await ScpClient({
        host: this.address,
        username: this.user,
        privateKey: fs.readFileSync(this.privateKey),
        port: Number(this.port),
      });

      // Upload de arquivos
      for (const fileName of fileNames) {
        const filePath = path.join(this.localPath, fileName);

        if (!fs.existsSync(filePath)) {
          await onFail(fileName, new Error(`File ${fileName} not found`)); // Aguarda onFail
          continue;
        }

        await client.uploadFile(
          filePath,
          path.join(this.remotePath, fileName),
          {
            step: (total, nb, fsize) => {
              const percentage = ((total / fsize) * 100).toFixed(2);
              onProgress(fileName, percentage);
            },
          }
        );

        await onSuccess(fileName); // Aguarda onSuccess
      }

      // Após o upload, limpar arquivos antigos
      await this.cleanupOldBackups();

      client.close();
    } catch (error) {
      console.log(error);

      for (const fileName of fileNames) {
        await onFail(fileName, error); // Aguarda onFail geral
      }
    }
  }

  // Método para limpar backups antigos no servidor
  private async cleanupOldBackups(): Promise<void> {
    const retentionDays = 2; // Manter apenas os últimos 3 dias
    const sftp = new SftpClient();
    let isConnected = false;

    await sftp.connect({
      host: this.address,
      port: this.port,
      username: this.user,
      privateKey: fs.readFileSync(this.privateKey),
      readyTimeout: 30000,
    });
    isConnected = true;

    const files = await sftp.list(this.remotePath);
    const backupFiles = files.filter((file) => file.name.endsWith(".GBK"));

    for (const file of backupFiles) {
      const fileDate = this.extractDateFromFileName(file.name).getTime();
      const currentDate = new Date();
      const retentionLimit = new Date();
      retentionLimit.setDate(currentDate.getDate() - retentionDays);

      if (fileDate < retentionLimit.getTime()) {
        await sftp.delete(`${this.remotePath}/${file.name}`);
        console.log(`Deleted old backup: ${file.name}`);
      }
    }
  }

  // Função para extrair a data do nome do arquivo
  private extractDateFromFileName(fileNameWithExtension: string): Date {
    const fileName = fileNameWithExtension.split(".")[0]; // Remove a extensão
    const dateParts = fileName.split("_"); // Divide o nome do arquivo por "_"

    const day = Number(dateParts[dateParts.length - 3]); // Dia
    const month = Number(dateParts[dateParts.length - 2]); // Mês
    const year = Number(dateParts[dateParts.length - 1]); // Ano

    return new Date(2000 + year, month - 1, day); // Ajusta para um objeto Date válido
  }
}
