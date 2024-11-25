import Store from "electron-store";
import path from "path";

// Configuração padrão
export const defaultSettings: SettingsStore = {
  theme: "light",
  backupCron: "00 08 * * *",
  dayToKeep: 30,
  backupFiles: [],
  outputFolder: path.join("c:", "bkp"),
  sendFile: false,
  pathRemote: "",
  sftpUser: "",
  sftpHost: "",
  sftpPort: "22",
  sshKeyPath: `/.ssh/id_rsa`,
};

// Defina a estrutura das configurações
export interface SettingsStore {
  theme: string;
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
}

// Crie uma instância do Store
export const store = new Store<SettingsStore>();

// Função para acessar as configurações
export const getSettings = (): SettingsStore => store.store;

// Função para atualizar as configurações
export const setSettings = (newSettings: SettingsStore): void => {
  store.set(newSettings);
};
