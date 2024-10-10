import { RegLocalRepository } from "../../../Infrastructure/Repositories/RegLocalRepository";
import { RegUpdateUseCase } from "./RegUpdateUseCase";

const regLocalRepository = new RegLocalRepository();

const regUpdateUseCase = new RegUpdateUseCase(regLocalRepository);

export { regUpdateUseCase };
