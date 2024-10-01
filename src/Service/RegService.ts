import { randomUUID } from "crypto";
import { Reg } from "../Model/Reg";
import { IRegService } from "./Interfaces/IRegService";

export class RegService implements IRegService {
  localdb: Reg[] = [];
  constructor() {
    // this.localdb.push({
    //   createdAt: new Date(),
    //   id: randomUUID(),
    //   name: "sim",
    //   status: "progress",
    // });
  }
  async update(reg: Reg): Promise<void> {
    const findIndex = this.localdb.findIndex((e) => e.id == reg.id);
    if (findIndex == -1) throw new Error("Id Not founded");
    this.localdb[findIndex] = reg;
  }
  async getAll(): Promise<Reg[]> {
    return this.localdb;
  }
  async save(reg: Reg): Promise<string> {
    this.localdb.push(reg);
    return reg.id;
  }
}
