import { RegEntity } from "../../../Domain/Entities/RegEntity";
import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegStartProccessInputDto } from "../../../Dtos/RegStartProccessDto";

export class RegStartProccessUseCase
  implements IUseCase<RegStartProccessInputDto, RegEntity>
{
  constructor(private regRepository: IRegRepository) {}
  async execute(input: RegStartProccessInputDto): Promise<RegEntity> {
    const reg = await this.regRepository.Get(input.id);

    //TO-DO: included typing for error
    if (!reg) throw new Error("Reg not found");

    reg.StartProcess();

    await this.regRepository.Update(reg);

    return reg;
  }
}
