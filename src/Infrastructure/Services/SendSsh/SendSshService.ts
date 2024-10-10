import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import {
  ISendService,
  SendOptions,
} from "../../../Domain/Services/ISendService";
const execAsync = promisify(exec);

export class SendSshService implements ISendService {
  localPath: string;
  remotePath: string;
  user: string;
  address: string;
  port: string;
  constructor(
    localPath: string,
    remotePath: string,
    user: string,
    address: string,
    port: string
  ) {
    this.localPath = localPath;
    this.remotePath = remotePath;
    this.user = user;
    this.address = address;
    this.port = port;
  }

  async execute({ onSuccess, onFail }: SendOptions): Promise<void> {
    try {
      const files = fs.readdirSync(this.localPath);
      const gbkFiles = files.filter((file) => file.endsWith(".GBK"));

      if (gbkFiles.length === 0) {
        console.log("Nenhum arquivo .gbk encontrado para enviar.");
        return;
      }

      const uploadPromises = gbkFiles.map(async (file) => {
        const localFilePath = path.join(this.localPath, file);
        const remoteFilePath = path.join(this.remotePath, file);

        const command = `scp -P ${this.port} "${localFilePath}" ${this.user}@${this.address}:"${remoteFilePath}"`;

        return await execAsync(command)
          .then(() => {
            console.log(`Arquivo enviado: ${file}`);
            //REMOVER ESSA GAMBIARRA
            onSuccess(file.split("_")[0]);
          })
          .catch((error) => {
            console.error(`Erro ao enviar ${file}: ${error.message}`);
            //REMOVER ESSA GAMBIARRA
            onFail(file.split("_")[0], error);
          });
      });

      await Promise.all(uploadPromises);

      console.log("Todos os arquivos foram enviados.");
    } catch (error) {
      console.error(`Erro: ${error.message}`);
    }
  }
}
