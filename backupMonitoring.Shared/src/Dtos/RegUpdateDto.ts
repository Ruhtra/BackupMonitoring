export interface RegUpdateInputDto {
  id: string;
  dbName?: string;
  statusBackup?: string;
  statusSend?: string;

  startBackup?: Date;
  finishBackup?: Date;

  createdAt?: Date;
}
