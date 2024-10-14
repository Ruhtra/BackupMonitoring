import { RegLocalRepository } from "../../../Infrastructure/Repositories/RegLocalRepository";
import { RegPrismaRepository } from "../../../Infrastructure/Repositories/RegPrismaRepository";
import { RegCreateUseCase } from "./RegCreateUseCase";

const regLocalRepository = new RegLocalRepository();
const regPrismaRepository = new RegPrismaRepository();

const regCreateUseCase = new RegCreateUseCase(regPrismaRepository);

export { regCreateUseCase };
