import { Request, Response } from "express";
import { IController } from "../../ICotnroller";
import { WebHookStartProccessInputDTO } from "backupmonitoring.shared/src/Dtos/WebHookStartProccessDTO";
import { regStartProccessUseCase } from "src/Application/RegUseCase/RegStartProccess";
import { regGetUseCase } from "src/Application/RegUseCase/RegGet";

export class WebHookStartProccess implements IController {
  async handle(request: Request, response: Response): Promise<any> {
    const a = request.body as WebHookStartProccessInputDTO;

    const reg = await regGetUseCase.execute({
      id: a.id,
    });

    if (!reg) response.sendStatus(404);

    await regStartProccessUseCase.execute({
      id: reg.id,
    });

    return response.sendStatus(200);
  }
}
