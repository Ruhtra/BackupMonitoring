import { RegLocalRepository } from "../../../Domain/Repositories/RegLocalRepository";
import { RegGetAllUseCase } from "./RegGetAllUseCase";

const regLocalRepository = new RegLocalRepository();

const regGetAllUseCase = new RegGetAllUseCase(regLocalRepository);

export { regGetAllUseCase };
