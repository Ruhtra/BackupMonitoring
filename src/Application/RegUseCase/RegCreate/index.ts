import { RegLocalRepository } from "../../../Infrastructure/Repositories/RegLocalRepository";
import { RegCreateUseCase } from "./RegCreateUseCase";

const regLocalRepository = new RegLocalRepository();

const regCreateUseCase = new RegCreateUseCase(regLocalRepository);

export { regCreateUseCase };
