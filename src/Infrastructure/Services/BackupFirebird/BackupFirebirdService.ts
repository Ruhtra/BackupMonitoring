import path from "path";
import fs from "fs";
import {
  BackupOptions,
  IBackupService,
} from "../../../Domain/Services/IBackupService";
import { exec } from "child_process";
import { formatDate } from "../../Utils";

export class BackupFirebirdService implements IBackupService {
  private firebirdPath: string;
  private databaseDirs: string[];
  private outputDir: string;
  private logDir: string;

  constructor(databaseDirs: string[], outputDir: string) {
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
  }

  private generateDatabaseDir(dbName: string): string | null {
    for (const dir of this.databaseDirs) {
      const dbPath = path.join(dir, dbName + ".FDB");
      if (fs.existsSync(dbPath)) {
        return dbPath;
      }
    }
    return null;
  }

  private verifyDatabaseFile(dbName: string): void {
    const matchingPaths = this.databaseDirs
      .map((dir) => path.join(dir, dbName + ".FDB"))
      .filter((dbPath) => fs.existsSync(dbPath));

    if (matchingPaths.length === 0) {
      throw new Error(
        `O arquivo de banco de dados para ${dbName} não existe em nenhum dos diretórios especificados.`
      );
    }

    if (matchingPaths.length > 1) {
      throw new Error(
        `Arquivos duplicados encontrados para o banco de dados ${dbName} em múltiplos diretórios: ${matchingPaths.join(
          ", "
        )}.`
      );
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

    const currentBackup = `${dbName}_${formatDate(currentDate)}.${extension}`;
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
    for (let i = 0; i <= daysToKeep; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      allowedDates.push(formatDate(date));
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

  private generateCommand(dbName: string): string {
    const outputFilePath = this.generateUniqueOutputFileName(dbName, 3);
    const inputFilePath = this.generateDatabaseDir(dbName);
    if (!inputFilePath) {
      throw new Error(
        `O banco de dados ${dbName} não foi encontrado em nenhum dos diretórios.`
      );
    }
    const outputFileLog = this.generateUniqueOutputFileName(dbName, 3, true);

    return `"${this.firebirdPath}" -B -b -v -y "${outputFileLog}" -user SYSDBA -password masterkey "${inputFilePath}" "${outputFilePath}"`;
  }

  private async bkp(
    dbName: string,
    onSuccess: (dbName: string) => Promise<void>,
    onFail: (dbName: string, error: Error | number) => Promise<void>
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.verifyDatabaseFile(dbName);
        const command = this.generateCommand(dbName);
        const backupProcess = exec(command);

        backupProcess.stdout?.on("data", (data) => {
          console.log(`Backup para ${dbName}: ${data}`);
        });

        backupProcess.stderr?.on("data", (data) => {
          console.error(`Erro ao fazer backup de ${dbName}: ${data}`);
          reject(new Error(data));
        });

        backupProcess.on("close", async (code) => {
          if (code === 0) {
            console.log(`Backup de ${dbName} concluído com sucesso!`);
            await onSuccess(dbName);
          } else {
            console.error(
              `Processo de backup de ${dbName} falhou com código ${code}`
            );
            await onFail(dbName, code);
          }

          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async MakeBackup({
    dbNames,
    onSuccess,
    onFail,
  }: BackupOptions): Promise<void> {
    try {
      const promises = dbNames.map((dbName) =>
        this.bkp(dbName, onSuccess, onFail)
      );

      const results = await Promise.allSettled(promises);

      for (const [index, result] of results.entries()) {
        if (result.status === "fulfilled") {
          console.log(
            `Backup para ${dbNames[index]} foi concluído com sucesso.`
          );
        } else {
          console.error(
            `Erro ao fazer backup para ${dbNames[index]}: ${result.reason}`
          );
          await onFail(dbNames[index], result.reason);
        }
      }

      console.log("Todos os backups foram executados com sucesso.");
    } catch (error) {
      console.error(`Erro ao executar o backup: ${error.message}`);
    }
  }
}
