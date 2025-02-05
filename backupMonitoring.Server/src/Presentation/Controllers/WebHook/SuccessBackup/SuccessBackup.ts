import { Request, Response } from "express";
import { IController } from "../../ICotnroller";
import { WebHookSuccessBackupInputDTO } from "backupmonitoring.shared/src/Dtos/WebHookSuccessBackupDTO";
import { regGetUseCase } from "src/Application/RegUseCase/RegGet";
import { regSuccessBackupUseCase } from "src/Application/RegUseCase/RegSuccessBackup";

export class WebHookSuccessBackup implements IController {
  async handle(request: Request, response: Response): Promise<any> {
    const a = request.body as WebHookSuccessBackupInputDTO;

    const reg = await regGetUseCase.execute({
      id: a.id,
    });

    if (!reg) response.sendStatus(404);

    await regSuccessBackupUseCase.execute({
      id: reg.id,
    });

    return response.sendStatus(200);
  }
}
