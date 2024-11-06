import { env } from "../../../env";
import { RegLocalRepository } from "../../../Infrastructure/Repositories/RegLocalRepository";
import { RegPrismaRepository } from "../../../Infrastructure/Repositories/RegPrismaRepository";
import { RegGetAllUseCase } from "./RegGetAllUseCase";

const isProduction = env.NODE_ENV === "production";
const regRepository = isProduction
  ? new RegPrismaRepository()
  : new RegLocalRepository();

const regGetAllUseCase = new RegGetAllUseCase(regRepository);

export { regGetAllUseCase };
