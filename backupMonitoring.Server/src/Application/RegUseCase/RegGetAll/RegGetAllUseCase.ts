import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { RegGetAllOutputDto } from "../../../Dtos/RegGetAllDto";
import { IUseCase } from "../../IUseCase";

export class RegGetAllUseCase implements IUseCase<void, RegGetAllOutputDto[]> {
  constructor(private regRepository: IRegRepository) {}

  async execute(input: void): Promise<RegGetAllOutputDto[]> {
    const regs = await this.regRepository.GetAll();

    // Ordenando por createdAt decrescente
    const sortedRegs = regs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sortedRegs.map((reg) => ({
      id: reg.id,
      dbName: reg.dbName,
      statusBackup: reg.statusBackup,
      statusSend: reg.statusSend,
      startBackup: reg.startBackup,
      finishBackup: reg.finishBackup,
      createdAt: reg.createdAt,
    }));
  }
}
