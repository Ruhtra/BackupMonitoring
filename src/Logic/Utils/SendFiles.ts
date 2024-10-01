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
      // Lê todos os arquivos do diretório local
      const files = fs.readdirSync(this.localPath);

      // Filtra arquivos que terminam com .gbk
      const gbkFiles = files.filter((file) => file.endsWith(".GBK"));

      if (gbkFiles.length === 0) {
        console.log("Nenhum arquivo .gbk encontrado para enviar.");
        return;
      }

      // Cria um array de promessas para enviar todos os arquivos
      const uploadPromises = gbkFiles.map((file) => {
        const localFilePath = path.join(this.localPath, file);
        const remoteFilePath = path.join(this.remotePath, file);

        // Comando SCP para enviar o arquivo
        const command = `scp.exe -P ${this.port} "${localFilePath}" ${this.user}@${this.address}:"${remoteFilePath}"`;

        return execAsync(command)
          .then(() => {
            console.log(`Arquivo enviado: ${file}`);
          })
          .catch((error) => {
            console.error(`Erro ao enviar ${file}: ${error.message}`);
          });
      });

      // Aguarda todas as promessas serem concluídas
      await Promise.all(uploadPromises);

      console.log("Todos os arquivos foram enviados.");
    } catch (error) {
      console.error(`Erro: ${error.message}`);
    }
  }
}
