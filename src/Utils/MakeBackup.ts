import path from "path";
import { exec } from "child_process";
import fs from "fs";

export class Gbak {
  firebirdPath: string;
  databaseDir: string;
  outputDir: string;

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
  }

  generateDatabaseDir(sourceDB: string) {
    return path.join(this.databaseDir, sourceDB + ".FDB");
  }

  generateOutputDir(sourceDB: string, version: number = 1) {
    return path.join(
      this.outputDir,
      `${sourceDB}_${String(version).padStart(2, "0")}.GBK`
    );
  }

  // Método para verificar se os arquivos de banco de dados existem
  verifyDatabaseFiles(databaseNames: string[]) {
    for (const dbName of databaseNames) {
      const dbPath = this.generateDatabaseDir(dbName);
      if (!fs.existsSync(dbPath)) {
        throw new Error(`O arquivo de banco de dados ${dbPath} não existe.`);
      }
    }
  }
  // Método para gerar um nome de arquivo de saída único
  generateUniqueOutputFileName(sourceDB: string): string {
    const firstFile = this.generateOutputDir(sourceDB, 1);
    const secondFile = this.generateOutputDir(sourceDB, 2);

    // Se não existem nem o _01 nem o _02, cria apenas o _01
    if (!fs.existsSync(firstFile) && !fs.existsSync(secondFile)) {
      return firstFile; // Retorna o caminho para o arquivo_01.GBK
    }

    // Se existe apenas o _01, cria o _02
    if (fs.existsSync(firstFile) && !fs.existsSync(secondFile)) {
      return secondFile; // Retorna o caminho para o arquivo_02.GBK
    }

    // Se existem ambos os arquivos _01 e _02
    if (fs.existsSync(firstFile) && fs.existsSync(secondFile)) {
      // Deleta o _01
      fs.unlinkSync(firstFile);
      // Renomeia o _02 para _01
      fs.renameSync(secondFile, firstFile);
    } else if (fs.existsSync(secondFile)) {
      // Se apenas o _02 existe, renomeia o _02 para _01
      fs.renameSync(secondFile, firstFile);
    }

    // Após todas as verificações e renomeações, retorna o caminho para o novo _02
    return this.generateOutputDir(sourceDB, 2); // Retorna o caminho para o arquivo_02.GBK
  }

  // Método para fazer o backup sem porcentagem
  async makeBackup(databaseNames: string[]) {
    try {
      // Verifica se todos os arquivos de banco de dados existem
      this.verifyDatabaseFiles(databaseNames);

      const commands = databaseNames.map((dbName) => {
        const outputFilePath = this.generateUniqueOutputFileName(dbName);
        const inputFielPath = this.generateDatabaseDir(dbName);
        return `"${this.firebirdPath}" -B -b -v -user SYSDBA -password masterkey "${inputFielPath}" "${outputFilePath}"`;
      });

      const commandPromises = commands.map(async (command, index) => {
        return new Promise((resolve) => {
          const backupProcess = exec(command);

          backupProcess.stdout?.on("data", (data) => {
            // console.log(`Backup para ${databaseNames[index]}: ${data}`);
          });

          backupProcess.stderr?.on("data", (data) => {
            console.error(
              `Erro ao fazer backup de ${databaseNames[index]}: ${data}`
            );
          });

          backupProcess.on("close", (code) => {
            if (code === 0) {
              console.log(
                `Backup de ${databaseNames[index]} concluído com sucesso!`
              );
            } else {
              console.error(
                `Processo de backup de ${databaseNames[index]} falhou com código ${code}`
              );
            }
            resolve(code);
          });
        });
      });

      // Espera que todos os comandos sejam concluídos
      await Promise.all(commandPromises);

      console.log("Todos os comandos de backup foram executados.");
    } catch (error) {
      console.error(`Erro: ${error.message}`);
    }
  }
}
