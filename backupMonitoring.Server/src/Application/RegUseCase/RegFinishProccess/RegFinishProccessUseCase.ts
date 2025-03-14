import { RegEntity } from "../../../Domain/Entities/RegEntity";
import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegFinishProccessInputDto } from "../../../Dtos/RegFinishProccessDto";

export class RegFinishProccessUseCase
  implements IUseCase<RegFinishProccessInputDto, RegEntity>
{
  constructor(private regRepository: IRegRepository) {}
  async execute(input: RegFinishProccessInputDto): Promise<RegEntity> {
    const reg = await this.regRepository.Get(input.id);

    //TO-DO: included typing for error
    if (!reg) throw new Error("Reg not found");

    reg.FinishProcess();

    await this.regRepository.Update(reg);

    return reg;
  }
}
