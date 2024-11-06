import { env } from "../../../env";
import { RegLocalRepository } from "../../../Infrastructure/Repositories/RegLocalRepository";
import { RegPrismaRepository } from "../../../Infrastructure/Repositories/RegPrismaRepository";
import { RegCreateUseCase } from "./RegCreateUseCase";

const isProduction = env.NODE_ENV === "production";
const regRepository = isProduction
  ? new RegPrismaRepository()
  : new RegLocalRepository();

const regCreateUseCase = new RegCreateUseCase(regRepository);

export { regCreateUseCase };
