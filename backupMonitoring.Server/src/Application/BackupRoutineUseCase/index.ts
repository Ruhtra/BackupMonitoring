// import path from "path";
// import { RegLocalRepository } from "../../Infrastructure/Repositories/RegLocalRepository";
// import { BackupFirebirdService } from "../../Infrastructure/Services/BackupFirebird/BackupFirebirdService";
// import { BackupRoutineUseCase } from "./BackupRoutineUseCase";
// import { RegPrismaRepository } from "../../Infrastructure/Repositories/RegPrismaRepository";
// import { SendSftpService } from "../../Infrastructure/Services/SendSftp/SendSftpService";
// import { env } from "../../env";

// // Carregando as variáveis de ambiente
// const dbDir = env.DB_DIR.map((e) => path.join(e));
// const outputDir = path.join(env.OUTPUT_DIR);

// const isProduction = env.NODE_ENV === "production";
// const regRepository = isProduction
//   ? new RegPrismaRepository()
//   : new RegLocalRepository();

// const backupFirebirdService = new BackupFirebirdService(
//   dbDir,
//   outputDir,
//   env.DAYS_TO_KEEP
// );

// const userProfile = process.env["userProfile"] || "";
// if (userProfile === "") throw new Error("Unable to find privateKey");

// const sendScpService = env.SEND_FILE
//   ? new SendSftpService(
//       outputDir,
//       path.join(env.PATH_REMOTE),
//       env.SFTP_USER,
//       env.SFTP_HOST,
//       env.SFTP_PORT,
//       env.SSH_KEY_PATH,
//       env.DAYS_TO_KEEP
//     )
//   : null;

// const cronSchedule = isProduction
//   ? env.BACKUP_CRON
//   : `${new Date(Date.now() + 5000).getSeconds()} ${new Date(
//       Date.now() + 5000
//     ).getMinutes()} ${new Date(Date.now() + 5000).getHours()} * * *`;

// // Usando o cron job a partir da nova variável de ambiente
// const backupRoutineUseCase = new BackupRoutineUseCase(
//   regRepository,
//   backupFirebirdService,
//   cronSchedule,
//   env.BACKUP_NAMES,
//   sendScpService
// );

// export { backupRoutineUseCase };
