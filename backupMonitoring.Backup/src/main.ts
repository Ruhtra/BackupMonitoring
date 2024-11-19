import { IUseCase } from "backupmonitoring.shared/Interfaces/IUseCase";
export class BackupUseCase implements IUseCase<void, void> {
  constructor() {
    console.log("entrei");
  }
  execute(input: void): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
