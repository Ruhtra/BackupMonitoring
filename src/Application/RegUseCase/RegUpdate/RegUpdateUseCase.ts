import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegUpdateInputDto } from "./RegUpdateDto";

export class RegUpdateUseCase implements IUseCase<RegUpdateInputDto, void> {
  constructor(private regRepository: IRegRepository) {}
  async execute({ id, data }: RegUpdateInputDto): Promise<void> {
    const reg = await this.regRepository.Get(id);
    if (!reg) throw new Error("Not Found " + id);

    reg.update({
      statusBackup: data.statusBackup,
      statusSend: data.statusSend,
      finishBackup: data.finishBackup,
      startBackup: data.startBackup,
    });

    this.regRepository.Update(reg);
  }
}
