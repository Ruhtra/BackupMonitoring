export class RegGetInputDto {
  id: string;
}

export interface RegGetOutputDto {
  id: string;
  dbName: string;
  statusBackup: string;
  statusSend: string;

  startBackup?: Date;
  finishBackup?: Date;

  createdAt: Date;
}
