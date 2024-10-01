import { RegEntity } from "../../Entities/RegEntity";

export interface IRegRepository {
  getAll(): Promise<RegEntity[]>;
  save(Reg: RegEntity): Promise<string>;
  update(Reg: RegEntity): Promise<void>;
}
