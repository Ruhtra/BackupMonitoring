import { Request, Response } from "express";
import { IController } from "../../ICotnroller";
import { WebHookFinishSendingInputDTO } from "backupmonitoring.shared/src/Dtos/WebHookFinishSendingDTO";
import { regGetUseCase } from "src/Application/RegUseCase/RegGet";
import { regFinishSendingUseCase } from "src/Application/RegUseCase/RegFinishSending";

export class WebHookFinishSending implements IController {
  async handle(request: Request, response: Response): Promise<any> {
    const a = request.body as WebHookFinishSendingInputDTO;

    const reg = await regGetUseCase.execute({
      id: a.id,
    });

    if (!reg) response.sendStatus(404);

    await regFinishSendingUseCase.execute({
      id: reg.id,
      status: a.status,
    });

    return response.sendStatus(200);
  }
}
