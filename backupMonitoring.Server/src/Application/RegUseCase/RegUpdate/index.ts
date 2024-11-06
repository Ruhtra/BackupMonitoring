import { env } from "../../../env";
import { RegLocalRepository } from "../../../Infrastructure/Repositories/RegLocalRepository";
import { RegPrismaRepository } from "../../../Infrastructure/Repositories/RegPrismaRepository";
import { RegUpdateUseCase } from "./RegUpdateUseCase";

const isProduction = env.NODE_ENV === "production";
const regRepository = isProduction
  ? new RegPrismaRepository()
  : new RegLocalRepository();

const regUpdateUseCase = new RegUpdateUseCase(regRepository);

export { regUpdateUseCase };
