import { Request, Response } from "express";
import { IController } from "../../ICotnroller";
import { WebHookFinishProccessInputDTO } from "backupmonitoring.shared/src/Dtos/WebHookFinishProccessDTO";
import { regFinishProccessUseCase } from "src/Application/RegUseCase/RegFinishProccess";
import { regGetUseCase } from "src/Application/RegUseCase/RegGet";

export class WebHookFinishProccess implements IController {
  async handle(request: Request, response: Response): Promise<any> {
    const a = request.body as WebHookFinishProccessInputDTO;

    const reg = await regGetUseCase.execute({
      id: a.id,
    });

    if (!reg) response.sendStatus(404);

    await regFinishProccessUseCase.execute({
      id: reg.id,
    });

    return response.sendStatus(200);
  }
}
