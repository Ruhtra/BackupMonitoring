import { Request, Response } from "express";
import { IController } from "../../ICotnroller";
import {
  WebHookCreateInputDTO,
  WebHookCreateOutputDTO,
} from "backupmonitoring.shared/src/Dtos/WebHookCreateDTO";
import { regCreateUseCase } from "../../../../Application/RegUseCase/RegCreate";

export class WebHookCreate implements IController {
  async handle(request: Request, response: Response): Promise<any> {
    const a = request.body as WebHookCreateInputDTO;

    const reg = await regCreateUseCase.execute({
      dbName: a.dbName,
    });

    const out: WebHookCreateOutputDTO = {
      id: reg.id,
    };

    return response.json(out);
  }
}
