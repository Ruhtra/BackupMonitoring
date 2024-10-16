import path from "path";
import { RegLocalRepository } from "../../Infrastructure/Repositories/RegLocalRepository";
import { BackupFirebirdService } from "../../Infrastructure/Services/BackupFirebird/BackupFirebirdService";
import { BackupRoutineUseCase } from "./BackupRoutineUseCase";
import { RegPrismaRepository } from "../../Infrastructure/Repositories/RegPrismaRepository";
import { SendScpService } from "../../Infrastructure/Services/SendScp/SendScpService";
import { env } from "../../env";

const dbDir1 = path.join("C:", "Dados");
const dbDir2 = path.join("C:", "Dados2");
const outputDir = path.join("C:", "delete");
const pathRemote = path.join("C:", "BackupAntonioNovo");

const isProduction = env.NODE_ENV === "production";
const regRepository = isProduction
  ? new RegPrismaRepository()
  : new RegLocalRepository();

const backupFirebirdService = new BackupFirebirdService(
  [dbDir1, dbDir2],
  outputDir
);

const userProfile = process.env["userProfile"] || "";
if (userProfile == "") throw new Error("Unable to find privateKey");
const sendScpService = new SendScpService(
  outputDir,
  pathRemote,
  "n3",
  "187.19.216.31",
  "2890",
  path.join(userProfile, ".ssh", "id_rsa")
);

const backupRoutineUseCase = new BackupRoutineUseCase(
  regRepository,
  backupFirebirdService,
  sendScpService,
  "00 04 10 * * *",
  ["TESTE", "TESTE2"] as const
);

export { backupRoutineUseCase };
