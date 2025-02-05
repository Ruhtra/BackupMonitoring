import { env } from "../../../env";
import { RegLocalRepository } from "../../../Infrastructure/Repositories/RegLocalRepository";
import { RegPrismaRepository } from "../../../Infrastructure/Repositories/RegPrismaRepository";
import { RegStartProccessUseCase } from "./RegStartProccessUseCase";

const isProduction = env.NODE_ENV === "production";
const regRepository = isProduction
  ? new RegPrismaRepository()
  : new RegLocalRepository();

const regStartProccessUseCase = new RegStartProccessUseCase(regRepository);

export { regStartProccessUseCase };
