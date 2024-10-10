import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegUpdateInputDto } from "./RegUpdateDto";

export class RegUpdateUseCase implements IUseCase<RegUpdateInputDto, void> {
  constructor(private regRepository: IRegRepository) {}
  async execute({ id, data }: RegUpdateInputDto): Promise<void> {
    const reg = await this.regRepository.Get(id);
    if (!reg) throw new Error("Not Found " + id);

    reg.updateStatusBackup({
      statusBackup: data.statusBackup,
    });
    reg.updatestatusSend({
      statusSend: data.statusSend,
    });

    this.regRepository.Update(reg);
  }
}
