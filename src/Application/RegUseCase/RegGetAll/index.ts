import { RegLocalRepository } from "../../../Infrastructure/Repositories/RegLocalRepository";
import { RegGetAllUseCase } from "./RegGetAllUseCase";

const regLocalRepository = new RegLocalRepository();

const regGetAllUseCase = new RegGetAllUseCase(regLocalRepository);

export { regGetAllUseCase };
