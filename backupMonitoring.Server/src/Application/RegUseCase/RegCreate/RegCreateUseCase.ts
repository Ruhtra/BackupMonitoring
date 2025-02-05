import { RegEntity } from "../../../Domain/Entities/RegEntity";
import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegCreateInputDto } from "../../../Dtos/RegCreateDto";

export class RegCreateUseCase
  implements IUseCase<RegCreateInputDto, RegEntity>
{
  constructor(private regRepository: IRegRepository) {}
  async execute(input: RegCreateInputDto): Promise<RegEntity> {
    const reg = RegEntity.create({
      dbName: input.dbName,
    });

    await this.regRepository.Save(reg);

    return reg;
  }
}
