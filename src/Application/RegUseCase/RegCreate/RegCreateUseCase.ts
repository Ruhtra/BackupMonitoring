import { RegEntity } from "../../../Domain/Entities/RegEntity";
import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegCreateInputDto } from "./RegCreateDto";

export class RegCreateUseCase implements IUseCase<RegCreateInputDto, void> {
  constructor(private regRepository: IRegRepository) {}
  async execute(input: RegCreateInputDto): Promise<void> {
    const reg = RegEntity.create({
      dbName: input.dbName,
    });

    await this.regRepository.Save(reg);
  }
}
