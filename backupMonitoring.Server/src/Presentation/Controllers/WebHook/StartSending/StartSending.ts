import { Request, Response } from "express";
import { IController } from "../../ICotnroller";
import { WebHookStartSendingInputDTO } from "backupmonitoring.shared/src/Dtos/WebHookStartSendingDTO";
import { regGetUseCase } from "src/Application/RegUseCase/RegGet";
import { regStartSendingUseCase } from "src/Application/RegUseCase/RegStartSending";

export class WebHookStartSending implements IController {
  async handle(request: Request, response: Response): Promise<any> {
    const a = request.body as WebHookStartSendingInputDTO;

    const reg = await regGetUseCase.execute({
      id: a.id,
    });

    if (!reg) response.sendStatus(404);

    await regStartSendingUseCase.execute({
      id: reg.id,
    });

    return response.sendStatus(200);
  }
}
