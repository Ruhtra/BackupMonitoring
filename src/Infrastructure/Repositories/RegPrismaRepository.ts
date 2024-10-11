import { RegEntity } from "../../Domain/Entities/RegEntity";
import { IRegRepository } from "../../Domain/Repositories/IRegRepository";
import prismaClient from "../PrismaDb/PrismaClient";

export class RegPrismaRepository implements IRegRepository {
  async Save(regEntity: RegEntity): Promise<void> {
    await prismaClient.reg.create({
      data: {
        id: regEntity.id,
        createdAt: regEntity.createdAt,
        dbName: regEntity.dbName,
        statusBackup: regEntity.statusBackup,
        statusSend: regEntity.statusSend,
      },
    });
  }

  async Get(id: string): Promise<RegEntity> {
    const reg = await prismaClient.reg.findUnique({
      where: { id },
    });
    if (!reg) return null;

    return RegEntity.with({
      id: reg.id,
      dbName: reg.dbName,
      // Usando 'as unknown' para fazer a conversão de tipos
      statusBackup: reg.statusBackup as
        | "progress"
        | "success"
        | "error"
        | "idle",
      statusSend: reg.statusSend as "progress" | "success" | "error" | "idle",
      createdAt: reg.createdAt,
    });
  }

  async GetAll(): Promise<RegEntity[]> {
    const regs = await prismaClient.reg.findMany();

    return regs.map((reg) =>
      RegEntity.with({
        id: reg.id,
        dbName: reg.dbName,
        statusBackup: reg.statusBackup as unknown as
          | "progress"
          | "success"
          | "error"
          | "idle",
        statusSend: reg.statusSend as unknown as
          | "progress"
          | "success"
          | "error"
          | "idle",
        createdAt: reg.createdAt,
      })
    );
  }

  async Update(regEntity: RegEntity): Promise<void> {
    await prismaClient.reg.update({
      where: { id: regEntity.id },
      data: {
        dbName: regEntity.dbName,
        statusBackup: regEntity.statusBackup,
        statusSend: regEntity.statusSend,
      },
    });
  }
}
