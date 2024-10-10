export interface BackupOptions {
  dbNames: string[];
  onSuccess: (dbName: string) => void;
  onFail: (dbName: string, error: Error | number) => void;
}

export interface IBackupService {
  MakeBackup(options: BackupOptions): Promise<void>;
}
