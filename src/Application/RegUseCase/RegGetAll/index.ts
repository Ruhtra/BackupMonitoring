import { RegLocalRepository } from "../../../Infrastructure/Repositories/RegLocalRepository";
import { RegPrismaRepository } from "../../../Infrastructure/Repositories/RegPrismaRepository";
import { RegGetAllUseCase } from "./RegGetAllUseCase";

const regLocalRepository = new RegLocalRepository();
const regPrismaRepository = new RegPrismaRepository();

const regGetAllUseCase = new RegGetAllUseCase(regPrismaRepository);

export { regGetAllUseCase };
