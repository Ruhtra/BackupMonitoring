import path from "path";
import fs from "fs";
import { BackupOptions, IBackupService } from "./IBackupFirebirdService";
import { exec } from "child_process";
import { formatDateToString } from "../utils";

export class BackupFirebirdService implements IBackupService {
  private firebirdPath: string;
  private databaseDirs: string[];
  private outputDir: string;
  private logDir: string;
  private daysToKeep: number;

  constructor(databaseDirs: string[], outputDir: string, daysToKeep: number) {
    const programFilesX86 = process.env["ProgramFiles(x86)"] || "";
    this.firebirdPath = path.join(
      programFilesX86,
      "Firebird",
      "Firebird_2_5",
      "bin",
      "gbak.exe"
    );
    this.databaseDirs = databaseDirs;
    this.outputDir = outputDir;
    this.logDir = path.join(outputDir, "log");
    this.daysToKeep = daysToKeep;
  }

  private generateDatabaseDir(dbName: string): string | null {
    if (fs.existsSync(dbName)) {
      return dbName;
    }
    return null;
  }

  private verifyDatabaseFile(dbPathName: string): void {
    if (!fs.existsSync(dbPathName)) {
      throw new Error(`O arquivo de banco de dados ${dbPathName} não existe.`);
    }
  }

  private generateBackupFilename = (
    dbName: string,
    isLog: boolean = false
  ): string => {
    const currentDate = new Date();
    const outputDir = isLog ? this.logDir : this.outputDir;
    const extension = isLog ? "log" : "GBK";

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const currentBackup = `${dbName}_${formatDateToString(
      currentDate
    )}.${extension}`;
    return path.join(outputDir, currentBackup);
  };

  private generateUniqueOutputFileName = (
    dbName: string,
    daysToKeep: number,
    isLog: boolean = false
  ): string => {
    const outputDir = isLog ? this.logDir : this.outputDir;
    const extension = isLog ? "log" : "GBK";
    const currentDate = new Date();

    const allowedDates = [];
    for (let i = 0; i < daysToKeep; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      allowedDates.push(formatDateToString(date));
    }

    const currentBackup = this.generateBackupFilename(dbName, isLog);

    const files = fs
      .readdirSync(outputDir)
      .filter((file) => file.endsWith(`.${extension}`));

    let backupExists = false;

    files.forEach((file) => {
      const filePath = path.join(outputDir, file);
      const fileDate = file
        .split("_")
        .slice(-3)
        .join("_")
        .replace(`.${extension}`, "");

      if (!allowedDates.includes(fileDate)) {
        fs.unlinkSync(filePath);
      } else if (path.join(outputDir, file) === currentBackup) {
        fs.unlinkSync(filePath);
        backupExists = true;
      }
    });

    return currentBackup;
  };

  private generateCommand(pathname: string): string {
    const outputFilePath = this.generateUniqueOutputFileName(
      path.basename(pathname).split(".")[0],
      this.daysToKeep
    );
    const inputFilePath = this.generateDatabaseDir(pathname);
    if (!inputFilePath) {
      throw new Error(
        `O banco de dados ${pathname} não foi encontrado em nenhum dos diretórios.`
      );
    }
    const outputFileLog = this.generateUniqueOutputFileName(
      path.basename(pathname).split(".")[0],
      this.daysToKeep,
      true
    );

    return `"${this.firebirdPath}" -B -b -v -y "${outputFileLog}" -user SYSDBA -password masterkey "${inputFilePath}" "${outputFilePath}"`;
  }

  private async bkp(
    dbPathName: string,
    onSuccess: (dbName: string) => Promise<void>,
    onFail: (dbName: string, error: Error | number) => Promise<void>
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.verifyDatabaseFile(dbPathName);
        const command = this.generateCommand(dbPathName);
        console.log(command);

        const backupProcess = exec(command);

        backupProcess.stdout?.on("data", (data) => {
          console.log(`Backup para ${dbPathName}: ${data}`);
        });

        backupProcess.stderr?.on("data", (data) => {
          console.error(`Erro ao fazer backup de ${dbPathName}: ${data}`);
          reject(new Error(data));
        });

        backupProcess.on("close", async (code) => {
          if (code === 0) {
            console.log(`Backup de ${dbPathName} concluído com sucesso!`);
            await onSuccess(dbPathName);
          } else {
            console.error(
              `Processo de backup de ${dbPathName} falhou com código ${code}`
            );
            await onFail(dbPathName, code);
          }

          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async MakeBackup({
    backupsFilePath,
    onSuccess,
    onFail,
  }: BackupOptions): Promise<void> {
    try {
      const promises = backupsFilePath.map((dbName) =>
        this.bkp(dbName, onSuccess, onFail)
      );

      const results = await Promise.allSettled(promises);

      for (const [index, result] of results.entries()) {
        if (result.status === "fulfilled") {
          console.log(
            `Backup para ${backupsFilePath[index]} foi concluído com sucesso.`
          );
        } else {
          console.error(
            `Erro ao fazer backup para ${backupsFilePath[index]}: ${result.reason}`
          );
          await onFail(backupsFilePath[index], result.reason);
        }
      }

      console.log("Todos os backups foram executados com sucesso.");
    } catch (error) {
      console.error(`Erro ao executar o backup: ${error.message}`);
    }
  }
}
