import { RegEntity } from "../../../Domain/Entities/RegEntity";
import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegStartBackupInputDto } from "../../../Dtos/RegStartBackupDto";

export class RegStartBackupUseCase
  implements IUseCase<RegStartBackupInputDto, RegEntity>
{
  constructor(private regRepository: IRegRepository) {}
  async execute(input: RegStartBackupInputDto): Promise<RegEntity> {
    const reg = await this.regRepository.Get(input.id);

    //TO-DO: included typing for error
    if (!reg) throw new Error("Reg not found");

    reg.StartBackup();

    await this.regRepository.Update(reg);

    return reg;
  }
}
