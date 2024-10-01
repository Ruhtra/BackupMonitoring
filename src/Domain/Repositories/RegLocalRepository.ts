import { RegEntity } from "../Entities/RegEntity";
import { IRegRepository } from "./Interfaces/IRegRepository";

export class RegLocalRepository implements IRegRepository {
  private static localDb: RegEntity[] = [];

  async getAll(): Promise<RegEntity[]> {
    return RegLocalRepository.localDb;
  }

  async save(Reg: RegEntity): Promise<string> {
    RegLocalRepository.localDb.push(Reg);
    return Reg.id;
  }

  async update(Reg: RegEntity): Promise<void> {
    const findIndex = RegLocalRepository.localDb.findIndex(
      (e) => e.id === Reg.id
    );
    if (findIndex === -1) throw new Error("Id Not found");
    RegLocalRepository.localDb[findIndex] = Reg;
  }
}
