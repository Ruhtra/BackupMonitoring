import { Request, Response } from "express";
import { IController } from "../../ICotnroller";
import { WebHookFinishBackupInputDTO } from "backupmonitoring.shared/src/Dtos/WebHookFinishBackupDTO";
import { regGetUseCase } from "../../../../Application/RegUseCase/RegGet";
import { regFailBackupUseCase } from "../../../../Application/RegUseCase/RegFinishBackup";

export class WebHookFinishBackup implements IController {
  async handle(request: Request, response: Response): Promise<any> {
    const a = request.body as WebHookFinishBackupInputDTO;

    const reg = await regGetUseCase.execute({
      id: a.id,
    });

    if (!reg) response.sendStatus(404);

    await regFailBackupUseCase.execute({
      id: reg.id,
      status: a.status,
    });

    return response.sendStatus(200);
  }
}
