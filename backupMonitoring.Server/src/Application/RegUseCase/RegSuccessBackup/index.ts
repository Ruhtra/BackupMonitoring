import { env } from "../../../env";
import { RegLocalRepository } from "../../../Infrastructure/Repositories/RegLocalRepository";
import { RegPrismaRepository } from "../../../Infrastructure/Repositories/RegPrismaRepository";
import { RegSuccessBackupUseCase } from "./RegSuccessUseCase";

const isProduction = env.NODE_ENV === "production";
const regRepository = isProduction
  ? new RegPrismaRepository()
  : new RegLocalRepository();

const regSuccessBackupUseCase = new RegSuccessBackupUseCase(regRepository);

export { regSuccessBackupUseCase };
