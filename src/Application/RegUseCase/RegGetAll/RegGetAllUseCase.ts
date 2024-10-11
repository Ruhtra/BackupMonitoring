import { IRegRepository } from "../../../Domain/Repositories/IRegRepository";
import { IUseCase } from "../../IUseCase";
import { RegGetAllOutputDto } from "./RegGetAllDto";

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
      createdAt: reg.createdAt,
    }));
  }
}
