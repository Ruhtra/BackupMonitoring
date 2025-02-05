import { RegEntity } from "../../../Domain/Entities/RegEntity";
import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegSuccessBackupInputDto } from "../../../Dtos/RegSuccessBackupDto";

export class RegSuccessBackupUseCase
  implements IUseCase<RegSuccessBackupInputDto, RegEntity>
{
  constructor(private regRepository: IRegRepository) {}
  async execute(input: RegSuccessBackupInputDto): Promise<RegEntity> {
    const reg = await this.regRepository.Get(input.id);

    //TO-DO: included typing for error
    if (!reg) throw new Error("Reg not found");
    reg.FinishBackup("success");
    await this.regRepository.Update(reg);

    return reg;
  }
}
