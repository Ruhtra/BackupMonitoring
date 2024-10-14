import { RegLocalRepository } from "../../../Infrastructure/Repositories/RegLocalRepository";
import { RegPrismaRepository } from "../../../Infrastructure/Repositories/RegPrismaRepository";
import { RegUpdateUseCase } from "./RegUpdateUseCase";

const regLocalRepository = new RegLocalRepository();
const regPrismaRepository = new RegPrismaRepository();

const regUpdateUseCase = new RegUpdateUseCase(regPrismaRepository);

export { regUpdateUseCase };
