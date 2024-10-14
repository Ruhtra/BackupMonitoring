import { Client } from "node-scp";
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
      const client = await Client({
        host: this.address, // substituir pelo seu host
        username: this.user, // substituir pelo seu usuário
        privateKey: fs.readFileSync(this.privateKey),
        port: this.port, // porta SSH padrão
      });

      for (const fileName of fileNames) {
        const filePath = path.join(this.localPath, fileName); // substituir pelo caminho do arquivo

        if (!fs.existsSync(filePath)) {
          onFail(fileName, new Error(`File ${fileName} not found`));
          continue;
        }

        await client.uploadFile(
          filePath,
          path.join(this.remotePath, fileName),
          {
            step: (total, nb, fsize) => {
              const percentage = ((total / fsize) * 100).toFixed(2); // Calcula a porcentagem e formata para duas casas decimais
              onProgress(fileName, percentage); // Passa a string formatada com o símbolo de porcentagem
            },
          }
        );
        onSuccess(fileName);
      }

      client.close();
    } catch (error) {
      console.log(error);

      fileNames.forEach((fileName) => onFail(fileName, error)); // Falha geral
    }
  }
}
