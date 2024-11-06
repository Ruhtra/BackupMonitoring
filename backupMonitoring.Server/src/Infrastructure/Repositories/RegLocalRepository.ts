import { RegEntity } from "../../Domain/Entities/RegEntity";
import { IRegRepository } from "../../Domain/Repositories/IRegRepository";

export class RegLocalRepository implements IRegRepository {
  //ISSO SAI DAQUI
  private static localDb: RegEntity[] = [
    // RegEntity.create({
    //   dbName: "ableble",
    // }),
    // RegEntity.create({
    //   dbName: "teste",
    // }),
    RegEntity.with({
      dbName: "ableble",
      createdAt: new Date("2024-10-10"),
      statusBackup: "idle",
      statusSend: "error",
      id: "id9038208490290432",
    }),
    RegEntity.with({
      dbName: "ableble",
      createdAt: new Date("2024-10-09"),
      statusBackup: "idle",
      statusSend: "error",
      id: "id9038208490290432",
    }),
    RegEntity.with({
      dbName: "ableble",
      createdAt: new Date("2024-10-08"),
      statusBackup: "idle",
      statusSend: "error",
      id: "id9038208490290432",
    }),
  ];
  constructor() {}

  async Save(RegEntity: RegEntity): Promise<void> {
    const reg = await this.Get(RegEntity.id);
    if (reg) throw new Error(`Reg with id ${RegEntity.id} already exist!`);

    RegLocalRepository.localDb.push(RegEntity);
  }
  async Get(id: string): Promise<RegEntity> {
    const reg = RegLocalRepository.localDb.find((reg) => reg.id == id);
    if (reg) return reg;
    else return null;
  }
  async GetAll(): Promise<RegEntity[]> {
    return RegLocalRepository.localDb;
  }
  async Update(regEntity: RegEntity): Promise<void> {
    const index = RegLocalRepository.localDb.findIndex(
      (db) => db.id === regEntity.id
    );
    if (index === -1)
      throw new Error(`Reg with id ${regEntity.id} does not exist!`);

    RegLocalRepository.localDb[index] = regEntity;
  }
}
