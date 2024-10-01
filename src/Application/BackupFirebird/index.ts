import { RegLocalRepository } from "../../Domain/Repositories/RegLocalRepository";
import { BackupFirebirdUseCase } from "./BackupFirebirdUseCase";

const regLocalRepository = new RegLocalRepository();
const backupFirebirdUseCase = new BackupFirebirdUseCase(regLocalRepository);

export { backupFirebirdUseCase };
