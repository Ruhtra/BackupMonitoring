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

  private send(
    fileName: string,
    onSuccess: (dbName: string) => void,
    onFail: (dbName: string, error: Error | number) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      const localFilePath = path.join(this.localPath, fileName);
      const remoteFilePath = path.join(this.remotePath, fileName);

      const command = `scp -P ${this.port} "${localFilePath}" ${this.user}@${this.address}:"${remoteFilePath}"`;

      execAsync(command)
        .then(() => {
          console.log(`Arquivo enviado: ${fileName}`);
          //REMOVER ESSA GAMBIARRA
          onSuccess(fileName.split("_")[0]);
        })
        .catch((error) => {
          console.error(`Erro ao enviar ${fileName}: ${error.message}`);
          //REMOVER ESSA GAMBIARRA
          onFail(fileName.split("_")[0], error);
        })
        .finally(() => {
          resolve();
        });
    });
  }

  async execute({ fileNames, onSuccess, onFail }: SendOptions): Promise<void> {
    try {
      const promises = fileNames.map((fileName) =>
        this.send(fileName, onSuccess, onFail)
      );
      const results = await Promise.allSettled(promises);

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          console.log(
            `Envio de ${fileNames[index]} foi concluído com sucesso.`
          );
        } else {
          console.error(
            `Erro ao fazer envio dev ${fileNames[index]}: ${result.reason}`
          );
          onFail(fileNames[index], result.reason);
        }
      });
      console.log("Todos os arquivos foram enviados.");

      // const files = fs.readdirSync(this.localPath);
      // const gbkFiles = files.filter((file) => file.endsWith(".GBK"));

      // if (gbkFiles.length === 0) {
      //   console.log("Nenhum arquivo .gbk encontrado para enviar.");
      //   return;
      // }

      // const uploadPromises = gbkFiles.map(async (file) => {
      //   const localFilePath = path.join(this.localPath, file);
      //   const remoteFilePath = path.join(this.remotePath, file);

      //   const command = `scp -P ${this.port} "${localFilePath}" ${this.user}@${this.address}:"${remoteFilePath}"`;

      //   return await execAsync(command)
      //     .then(() => {
      //       console.log(`Arquivo enviado: ${file}`);
      //       //REMOVER ESSA GAMBIARRA
      //       onSuccess(file.split("_")[0]);
      //     })
      //     .catch((error) => {
      //       console.error(`Erro ao enviar ${file}: ${error.message}`);
      //       //REMOVER ESSA GAMBIARRA
      //       onFail(file.split("_")[0], error);
      //     });
      // });

      // await Promise.all(uploadPromises);

      // });
    } catch (error) {
      console.error(`Erro: ${error.message}`);
    }
  }
}
