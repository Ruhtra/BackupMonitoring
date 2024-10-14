import path from "path";
import fs from "fs";
import {
  BackupOptions,
  IBackupService,
} from "../../../Domain/Services/IBackupService";
import { exec } from "child_process";

export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2); // últimos 2 dígitos
  return `${day}_${month}_${year}`;
};

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

  private verifyDatabaseFile(dbName: string): void {
    const dbPath = this.generateDatabaseDir(dbName);
    if (!fs.existsSync(dbPath)) {
      throw new Error(`O arquivo de banco de dados ${dbPath} não existe.`);
    }
  }

  // Função para gerar o nome do arquivo de backup
  private generateBackupFilename = (
    dbName: string,
    isLog: boolean = false
  ): string => {
    const currentDate = new Date();
    const outputDir = isLog ? this.logDir : this.outputDir;
    const extension = isLog ? "log" : "GBK"; // Define a extensão com base no tipo de arquivo

    // Cria a pasta de backup se ela não existir
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const currentBackup = `${dbName}_${formatDate(currentDate)}.${extension}`;
    return path.join(outputDir, currentBackup); // Retorna o nome do backup (sem manipulação de arquivos)
  };

  private generateUniqueOutputFileName = (
    dbName: string,
    daysToKeep: number,
    isLog: boolean = false
  ): string => {
    const outputDir = isLog ? this.logDir : this.outputDir;
    const extension = isLog ? "log" : "GBK"; // Define a extensão com base no tipo de arquivo
    const currentDate = new Date();

    // Gera uma lista de datas permitidas (dias anteriores até o limite especificado)
    const allowedDates = [];
    for (let i = 0; i <= daysToKeep; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      allowedDates.push(formatDate(date));
    }

    const currentBackup = this.generateBackupFilename(dbName, isLog);

    // Lê os arquivos existentes na pasta
    const files = fs
      .readdirSync(outputDir)
      .filter((file) => file.endsWith(`.${extension}`));

    let backupExists = false;

    // Percorre os arquivos existentes
    files.forEach((file) => {
      const filePath = path.join(outputDir, file);
      const fileDate = file
        .split("_")
        .slice(-3)
        .join("_")
        .replace(`.${extension}`, "");

      // Deleta backups que não estão na lista de datas permitidas
      if (!allowedDates.includes(fileDate)) {
        fs.unlinkSync(filePath);
      } else if (path.join(outputDir, file) === currentBackup) {
        // Se já houver um backup para a data atual, deleta
        fs.unlinkSync(filePath);
        backupExists = true;
      }
    });

    return currentBackup; // Retorna o nome do arquivo de backup único
  };

  private generateCommand(dbName: string): string {
    const outputFilePath = this.generateUniqueOutputFileName(dbName, 3);
    const inputFilePath = this.generateDatabaseDir(dbName);
    const outputFileLog = this.generateUniqueOutputFileName(dbName, 3, true);

    return `"${this.firebirdPath}" -B -b -v -y "${outputFileLog}" -user SYSDBA -password masterkey "${inputFilePath}" "${outputFilePath}"`;
  }

  private bkp(
    dbName: string,
    onSuccess: (dbName: string) => void,
    onFail: (dbName: string, error: Error | number) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      this.verifyDatabaseFile(dbName);
      const command = this.generateCommand(dbName);
      const backupProcess = exec(command);

      backupProcess.stdout?.on("data", (data) => {
        console.log(`Backup para ${dbName}: ${data}`);
      });

      backupProcess.stderr?.on("data", (data) => {
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

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          console.log(
            `Backup para ${dbNames[index]} foi concluído com sucesso.`
          );
        } else {
          console.error(
            `Erro ao fazer backup para ${dbNames[index]}: ${result.reason}`
          );
          onFail(dbNames[index], result.reason);
        }
      });

      console.log("Todos os backups foram executados com sucesso.");
    } catch (error) {
      console.error(`Erro ao executar o backup: ${error.message}`);
    }
  }
}
