import path from "path";
import { RegLocalRepository } from "../../Infrastructure/Repositories/RegLocalRepository";
import { BackupFirebirdService } from "../../Infrastructure/Services/BackupFirebird/BackupFirebirdService";
import { BackupRoutineUseCase } from "./BackupRoutineUseCase";
import { SendSshService } from "../../Infrastructure/Services/SendSsh/SendSshService";
import { RegPrismaRepository } from "../../Infrastructure/Repositories/RegPrismaRepository";

const dbDir = path.join("C:", "Dados");
const outputDir = path.join("C:", "bkp");
const pathRemote = path.join("C:", "BackupAntonio");

const regLocalRepository = new RegLocalRepository();
const regPrismaRepository = new RegPrismaRepository();
const backupFirebirdService = new BackupFirebirdService(dbDir, outputDir);
const sendSshService = new SendSshService(
  outputDir,
  pathRemote,
  "n3",
  "187.19.216.31",
  "2890"
);

const backupRoutineUseCase = new BackupRoutineUseCase(
  regLocalRepository,
  backupFirebirdService,
  sendSshService
);

export { backupRoutineUseCase };
