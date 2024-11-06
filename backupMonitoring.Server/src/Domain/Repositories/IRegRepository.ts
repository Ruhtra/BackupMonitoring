import { RegEntity } from "../Entities/RegEntity";

export interface IRegRepository {
  Save(RegEntity: RegEntity): Promise<void>;
  Get(id: string): Promise<RegEntity>;
  GetAll(): Promise<RegEntity[]>;
  Update(RegEntity: RegEntity): Promise<void>;
}
