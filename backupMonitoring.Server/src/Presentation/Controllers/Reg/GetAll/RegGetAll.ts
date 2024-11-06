import { Request, Response } from "express";
import { IController } from "../../ICotnroller";
import { regGetAllUseCase } from "../../../../Application/RegUseCase/RegGetAll";

export class RegGetAll implements IController {
  async handle(request: Request, response: Response): Promise<any> {
    const regs = await regGetAllUseCase.execute();

    return response.json(regs);
  }
}
