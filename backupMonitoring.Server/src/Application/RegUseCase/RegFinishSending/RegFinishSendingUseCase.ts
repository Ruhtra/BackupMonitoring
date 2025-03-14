import { RegEntity } from "../../../Domain/Entities/RegEntity";
import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegFinishSendingInputDto } from "../../../Dtos/RegFinishtSendingDto";

export class RegFinishSendingUseCase
  implements IUseCase<RegFinishSendingInputDto, RegEntity>
{
  constructor(private regRepository: IRegRepository) {}
  async execute(input: RegFinishSendingInputDto): Promise<RegEntity> {
    const reg = await this.regRepository.Get(input.id);

    //TO-DO: included typing for error
    if (!reg) throw new Error("Reg not found");

    if (input.status == "success") reg.FinishSend("success");
    if (input.status == "fail") reg.FinishSend("error");

    await this.regRepository.Update(reg);

    return reg;
  }
}
