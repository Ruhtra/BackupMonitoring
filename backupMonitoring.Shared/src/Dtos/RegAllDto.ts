export interface RegGetAllOutputDto {
  id: string;
  dbName: string;
  statusBackup: string;
  statusSend: string;

  startBackup?: Date;
  finishBackup?: Date;

  createdAt: Date;
}
