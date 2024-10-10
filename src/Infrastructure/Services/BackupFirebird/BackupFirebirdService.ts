import path from "path";
import fs from "fs";
import {
  BackupOptions,
  IBackupService,
} from "../../../Domain/Services/IBackupService";
import { exec } from "child_process";

export class BackupFirebirdService implements IBackupService {
  private firebirdPath: string;
  private databaseDir: string;
  private outputDir: string;
  private logDir: string;

  constructor(databaseDir: string, outputDir: string) {
    const programFilesX86 = process.env["ProgramFiles(x86)"] || "";
    this.firebirdPath = path.join(
      programFilesX86,
      "Firebird",
      "Firebird_2_5",
      "bin",
      "gbak.exe"
    );
    this.databaseDir = databaseDir;
    this.outputDir = outputDir;
    this.logDir = path.join(outputDir, "log");
  }

  private generateDatabaseDir(sourceDB: string): string {
    return path.join(this.databaseDir, sourceDB + ".FDB");
  }

  private generateOutputDir(
    sourceDB: string,
    type: "database" | "log",
    version: number = 1
  ): string {
    const ext = type === "database" ? "GBK" : "LOG";
    const output = type === "database" ? this.outputDir : this.logDir;
    return path.join(
      output,
      `${sourceDB}_${String(version).padStart(2, "0")}.${ext}`
    );
  }

  private verifyDatabaseFile(dbName: string): void {
    const dbPath = this.generateDatabaseDir(dbName);
    if (!fs.existsSync(dbPath)) {
      throw new Error(`O arquivo de banco de dados ${dbPath} não existe.`);
    }
  }

  private verifyDatabaseFiles(databaseNames: string[]): void {
    for (const dbName of databaseNames) {
      this.verifyDatabaseFile(dbName);
    }
  }

  private generateUniqueOutputFileName(
    sourceDB: string,
    type: "database" | "log"
  ): string {
    const firstFile = this.generateOutputDir(sourceDB, type, 1);
    const secondFile = this.generateOutputDir(sourceDB, type, 2);

    if (!fs.existsSync(firstFile) && !fs.existsSync(secondFile))
      return firstFile;
    if (fs.existsSync(firstFile) && !fs.existsSync(secondFile))
      return secondFile;
    if (fs.existsSync(firstFile) && fs.existsSync(secondFile)) {
      fs.unlinkSync(firstFile);
      fs.renameSync(secondFile, firstFile);
    } else {
      fs.renameSync(secondFile, firstFile);
    }

    return this.generateOutputDir(sourceDB, type, 2);
  }

  private generateCommand(dbName: string): string {
    const outputFilePath = this.generateUniqueOutputFileName(
      dbName,
      "database"
    );
    const inputFilePath = this.generateDatabaseDir(dbName);
    const outputFileLog = this.generateUniqueOutputFileName(dbName, "log");
    return `"${this.firebirdPath}" -B -b -v -y "${outputFileLog}" -user SYSDBA -password masterkey "${inputFilePath}" "${outputFilePath}"`;
  }

  private bkp(
    dbName: string,
    onSuccess: (dbName: string) => void,
    onFail: (dbName: string, error: Error | number) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      const command = this.generateCommand(dbName);
      const backupProcess = exec(command);

      backupProcess.stdout?.on("data", (data) => {
        console.log(`Backup para ${dbName}: ${data}`);
      });

      backupProcess.stderr?.on("error", (data) => {
        console.error(`Erro ao fazer backup de ${dbName}: ${data}`);
        onFail(dbName, data);
      });

      backupProcess.on("close", (code) => {
        if (code === 0) {
          console.log(`Backup de ${dbName} concluído com sucesso!`);
          onSuccess(dbName);
        } else {
          console.error(
            `Processo de backup de ${dbName} falhou com código ${code}`
          );
          onFail(dbName, code);
        }

        resolve();
      });
    });
  }

  async MakeBackup(options: BackupOptions): Promise<void> {
    const { dbNames, onSuccess, onFail } = options;

    try {
      this.verifyDatabaseFiles(dbNames);

      const promises = dbNames.map((dbName) =>
        this.bkp(dbName, onSuccess, onFail)
      );
      await Promise.all(promises);

      console.log("Todos os backups foram executados com sucesso.");
    } catch (error) {
      console.error(`Erro ao executar o backup: ${error.message}`);
    }
  }
}
