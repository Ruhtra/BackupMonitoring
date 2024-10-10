import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export class FileSender {
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

  async sendFiles() {
    try {
      const files = fs.readdirSync(this.localPath);
      const gbkFiles = files.filter((file) => file.endsWith(".GBK"));

      if (gbkFiles.length === 0) {
        console.log("Nenhum arquivo .gbk encontrado para enviar.");
        return;
      }

      const uploadPromises = gbkFiles.map((file) => {
        const localFilePath = path.join(this.localPath, file);
        const remoteFilePath = path.join(this.remotePath, file);

        const command = `scp.exe -P ${this.port} "${localFilePath}" ${this.user}@${this.address}:"${remoteFilePath}"`;

        return execAsync(command)
          .then(() => {
            console.log(`Arquivo enviado: ${file}`);
          })
          .catch((error) => {
            console.error(`Erro ao enviar ${file}: ${error.message}`);
          });
      });

      await Promise.all(uploadPromises);

      console.log("Todos os arquivos foram enviados.");
    } catch (error) {
      console.error(`Erro: ${error.message}`);
    }
  }
}
