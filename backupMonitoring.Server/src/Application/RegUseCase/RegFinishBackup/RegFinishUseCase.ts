import { RegEntity } from "../../../Domain/Entities/RegEntity";
import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegFinishBackupInputDto } from "../../../Dtos/RegFinishBackupDto";

export class RegFailBackupUseCase
  implements IUseCase<RegFinishBackupInputDto, RegEntity>
{
  constructor(private regRepository: IRegRepository) {}
  async execute(input: RegFinishBackupInputDto): Promise<RegEntity> {
    const reg = await this.regRepository.Get(input.id);

    //TO-DO: included typing for error
    if (!reg) throw new Error("Reg not found");

    if (input.status == "success") reg.FinishBackup("success");
    if (input.status == "fail") reg.FinishBackup("error");

    await this.regRepository.Update(reg);

    return reg;
  }
}
