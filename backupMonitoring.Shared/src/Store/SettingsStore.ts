export interface SettingsStore {
  backupConfig: {
    backupFiles: string[];
    dayToKeep: number;
    backupCron: string;
    outputFolder: string;

    sendFile: boolean;
    pathRemote?: string;
    sftpUser?: string;
    sftpHost?: string;
    sftpPort?: string;
    sshKeyPath?: string;
  };
  theme: string;
}
