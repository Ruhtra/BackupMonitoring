import { Reg } from "../../Model/Reg";

export interface IRegService {
  getAll(): Promise<Reg[]>;
  save(Reg: Reg): Promise<string>;
  update(Req: Reg): Promise<void>;
}
