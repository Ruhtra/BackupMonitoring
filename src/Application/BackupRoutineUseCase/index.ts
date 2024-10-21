import path from "path";
import { RegLocalRepository } from "../../Infrastructure/Repositories/RegLocalRepository";
import { BackupFirebirdService } from "../../Infrastructure/Services/BackupFirebird/BackupFirebirdService";
import { BackupRoutineUseCase } from "./BackupRoutineUseCase";
import { RegPrismaRepository } from "../../Infrastructure/Repositories/RegPrismaRepository";
import { SendSftpService } from "../../Infrastructure/Services/SendSftp/SendSftpService";
import { env } from "../../env";

// Carregando as variáveis de ambiente
const dbDir1 = path.join(env.DB_DIR1);
const dbDir2 = path.join(env.DB_DIR2);
const outputDir = path.join(env.OUTPUT_DIR);
const pathRemote = path.join(env.PATH_REMOTE);

const isProduction = env.NODE_ENV === "production";
const regRepository = isProduction
  ? new RegPrismaRepository()
  : new RegLocalRepository();

const backupFirebirdService = new BackupFirebirdService(
  [dbDir1, dbDir2],
  outputDir,
  env.DAYS_TO_KEEP
);

const userProfile = process.env["userProfile"] || "";
if (userProfile === "") throw new Error("Unable to find privateKey");

const sendScpService = new SendSftpService(
  outputDir,
  pathRemote,
  env.SCP_USER,
  env.SCP_HOST,
  env.SCP_PORT,
  env.SSH_KEY_PATH,
  env.DAYS_TO_KEEP
);

// Usando o cron job a partir da nova variável de ambiente
const backupRoutineUseCase = new BackupRoutineUseCase(
  regRepository,
  backupFirebirdService,
  sendScpService,
  env.BACKUP_CRON, // Usando a nova variável de ambiente
  env.BACKUP_NAMES
);

export { backupRoutineUseCase };
