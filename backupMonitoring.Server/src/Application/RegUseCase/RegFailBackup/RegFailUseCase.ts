import { RegEntity } from "../../../Domain/Entities/RegEntity";
import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegFailBackupInputDto } from "../../../Dtos/RegFailBackupDto";

export class RegFailBackupUseCase
  implements IUseCase<RegFailBackupInputDto, RegEntity>
{
  constructor(private regRepository: IRegRepository) {}
  async execute(input: RegFailBackupInputDto): Promise<RegEntity> {
    const reg = await this.regRepository.Get(input.id);

    //TO-DO: included typing for error
    if (!reg) throw new Error("Reg not found");
    reg.FinishBackup("error");
    await this.regRepository.Update(reg);

    return reg;
  }
}
