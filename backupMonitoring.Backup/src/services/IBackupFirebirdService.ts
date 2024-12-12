export interface BackupOptions {
  backupsFilePath: string[];
  onSuccess: (dbName: string) => Promise<void>;
  onFail: (dbName: string, error: Error | number) => Promise<void>;
}

export interface IBackupService {
  MakeBackup(options: BackupOptions): Promise<void>;
}
