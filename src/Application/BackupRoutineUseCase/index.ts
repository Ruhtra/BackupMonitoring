import path from "path";
import { RegLocalRepository } from "../../Infrastructure/Repositories/RegLocalRepository";
import { BackupFirebirdService } from "../../Infrastructure/Services/BackupFirebird/BackupFirebirdService";
import { BackupRoutineUseCase } from "./BackupRoutineUseCase";
import { RegPrismaRepository } from "../../Infrastructure/Repositories/RegPrismaRepository";
import { SendScpService } from "../../Infrastructure/Services/SendScp/SendScpService";

const dbDir = path.join("C:", "Dados");
const outputDir = path.join("C:", "bkp");
const pathRemote = path.join("C:", "BackupAntonio");

const regLocalRepository = new RegLocalRepository();
const regPrismaRepository = new RegPrismaRepository();
const backupFirebirdService = new BackupFirebirdService(dbDir, outputDir);

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
  regPrismaRepository,
  backupFirebirdService,
  sendScpService
);

export { backupRoutineUseCase };
