import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { RegGetInputDto, RegGetOutputDto } from "../../../Dtos/RegGetDto";
import { IUseCase } from "../../IUseCase";

export class RegGetUseCase
  implements IUseCase<RegGetInputDto, RegGetOutputDto>
{
  constructor(private regRepository: IRegRepository) {}

  async execute(input: RegGetInputDto): Promise<RegGetOutputDto> {
    const reg = await this.regRepository.Get(input.id);

    return {
      id: reg.id,
      dbName: reg.dbName,
      statusBackup: reg.statusBackup,
      statusSend: reg.statusSend,
      startBackup: reg.startBackup,
      finishBackup: reg.finishBackup,
      createdAt: reg.createdAt,
    };
  }
}
