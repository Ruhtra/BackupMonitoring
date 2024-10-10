import { IRegRepository } from "../../../Domain/Repositories/Interfaces/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegGetAllOutputDto } from "./RegGetAllDto";

export class RegGetAllUseCase implements IUseCase<void, RegGetAllOutputDto[]> {
  constructor(private regRepository: IRegRepository) {}
  async exeute(): Promise<RegGetAllOutputDto[]> {
    const repositories = await this.regRepository.getAll();

    return repositories.map((r) => {
      return {
        id: r.id,
        dbName: r.dbName,
        statusSsh: r.statusSsh,
        createdAt: r.createdAt,
        status: r.status,
      };
    });
  }
}
