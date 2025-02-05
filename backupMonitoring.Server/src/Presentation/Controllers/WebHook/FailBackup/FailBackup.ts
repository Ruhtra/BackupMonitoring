import { Request, Response } from "express";
import { IController } from "../../ICotnroller";
import { WebHookFailBackupInputDTO } from "backupmonitoring.shared/src/Dtos/WebHookFailBackupDTO";
import { regGetUseCase } from "src/Application/RegUseCase/RegGet";
import { regFailBackupUseCase } from "src/Application/RegUseCase/RegFailBackup";

export class WebHookFailBackup implements IController {
  async handle(request: Request, response: Response): Promise<any> {
    const a = request.body as WebHookFailBackupInputDTO;

    const reg = await regGetUseCase.execute({
      id: a.id,
    });

    if (!reg) response.sendStatus(404);

    await regFailBackupUseCase.execute({
      id: reg.id,
    });

    return response.sendStatus(200);
  }
}
