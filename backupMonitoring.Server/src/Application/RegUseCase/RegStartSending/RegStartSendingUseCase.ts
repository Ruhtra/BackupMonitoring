import { RegEntity } from "../../../Domain/Entities/RegEntity";
import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegStartSendingInputDto } from "../../../Dtos/RegStartSendingDto";

export class RegStartSendingUseCase
  implements IUseCase<RegStartSendingInputDto, RegEntity>
{
  constructor(private regRepository: IRegRepository) {}
  async execute(input: RegStartSendingInputDto): Promise<RegEntity> {
    const reg = await this.regRepository.Get(input.id);

    //TO-DO: included typing for error
    if (!reg) throw new Error("Reg not found");

    reg.StartSend();

    await this.regRepository.Update(reg);

    return reg;
  }
}
