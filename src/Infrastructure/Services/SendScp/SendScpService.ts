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
        host: this.address,
        username: this.user,
        privateKey: fs.readFileSync(this.privateKey),
        port: this.port,
      });

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

      client.close();
    } catch (error) {
      console.log(error);

      for (const fileName of fileNames) {
        await onFail(fileName, error); // Aguarda onFail geral
      }
    }
  }
}
