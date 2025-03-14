import { Request, Response } from "express";
import { IController } from "../../ICotnroller";
import { WebHookStartBackupInputDTO } from "backupmonitoring.shared/src/Dtos/WebHookStartBackupDTO";
import { regGetUseCase } from "../../../../Application/RegUseCase/RegGet";
import { regStartBackupUseCase } from "../../../../Application/RegUseCase/RegStartBackup";

export class WebHookStartBackup implements IController {
  async handle(request: Request, response: Response): Promise<any> {
    const a = request.body as WebHookStartBackupInputDTO;

    const reg = await regGetUseCase.execute({
      id: a.id,
    });

    if (!reg) response.sendStatus(404);

    await regStartBackupUseCase.execute({
      id: reg.id,
    });

    return response.sendStatus(200);
  }
}
