import path from "path";
import { exec } from "child_process";
import fs from "fs";

export class Gbak {
  firebirdPath: string;
  databaseDir: string;
  outputDir: string;
  logDir: string;

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

  generateDatabaseDir(sourceDB: string) {
    return path.join(this.databaseDir, sourceDB + ".FDB");
  }

  generateOutputDir(
    sourceDB: string,
    type: "database" | "log",
    version: number = 1
  ) {
    const ext = type == "database" ? "GBK" : "LOG";
    const output = type == "database" ? this.outputDir : this.logDir;
    return path.join(
      output,
      `${sourceDB}_${String(version).padStart(2, "0")}.${ext}`
    );
  }

  verifyDatabaseFiles(databaseNames: string[]) {
    for (const dbName of databaseNames) {
      const dbPath = this.generateDatabaseDir(dbName);
      if (!fs.existsSync(dbPath)) {
        throw new Error(`O arquivo de banco de dados ${dbPath} não existe.`);
      }
    }
  }

  generateUniqueOutputFileName(
    sourceDB: string,
    type: "database" | "log"
  ): string {
    const firstFile = this.generateOutputDir(sourceDB, type, 1);
    const secondFile = this.generateOutputDir(sourceDB, type, 2);

    const isEmpty = !fs.existsSync(firstFile) && !fs.existsSync(secondFile);
    const exist01and02 = fs.existsSync(firstFile) && fs.existsSync(secondFile);
    const onlyExist01 = fs.existsSync(firstFile) && !fs.existsSync(secondFile);
    const onlyExist02 = !fs.existsSync(firstFile) && fs.existsSync(secondFile);

    if (isEmpty) return firstFile;
    if (onlyExist01) return secondFile;
    if (exist01and02) {
      fs.unlinkSync(firstFile);
      fs.renameSync(secondFile, firstFile);
    }
    if (onlyExist02) fs.renameSync(secondFile, firstFile);

    return this.generateOutputDir(sourceDB, type, 2);
  }

  async makeBackup({
    databaseNames,
    onSuccess = () => {},
    onFail = () => {},
  }: {
    databaseNames: string[];
    onSuccess?: (bd: string) => void;
    onFail?: (bd: string) => void;
  }) {
    try {
      this.verifyDatabaseFiles(databaseNames);

      const commands = databaseNames.map((dbName) => {
        const outputFilePath = this.generateUniqueOutputFileName(
          dbName,
          "database"
        );
        const inputFielPath = this.generateDatabaseDir(dbName);
        const outputFileLog = this.generateUniqueOutputFileName(dbName, "log");
        return `"${this.firebirdPath}" -B -b -v -y "${outputFileLog}" -user SYSDBA -password masterkey "${inputFielPath}" "${outputFilePath}"`;
      });

      const commandPromises = commands.map(async (command, index) => {
        const dbName = databaseNames[index];
        console.log(command);

        return new Promise((resolve) => {
          const backupProcess = exec(command);

          backupProcess.stdout?.on("data", (data) => {
            console.log(`Backup para ${databaseNames[index]}: ${data}`);
          });

          backupProcess.stderr?.on("data", (data) => {
            console.error(
              `Erro ao fazer backup de ${databaseNames[index]}: ${data}`
            );
            onFail(dbName);
          });

          backupProcess.on("close", (code) => {
            if (code === 0) {
              console.log(
                `Backup de ${databaseNames[index]} concluído com sucesso!`
              );
              onSuccess(dbName);
            } else {
              console.error(
                `Processo de backup de ${databaseNames[index]} falhou com código ${code}`
              );
              onFail(dbName);
            }
            resolve(code);
          });
        });
      });

      await Promise.all(commandPromises);
      console.log("Todos os comandos de backup foram executados.");
    } catch (error) {
      console.error(`Erro: ${error.message}`);
    }
  }
}
