import Store from "electron-store";
import path from "path";

//puxar da shared
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

// Configuração padrão
export const defaultSettings: SettingsStore = {
  backupConfig: {
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
  },
  theme: "light",
};

// Defina a estrutura das configurações
// Crie uma instância do Store
export const store = new Store<SettingsStore>();

// Função para acessar as configurações
export const getSettings = (): SettingsStore => store.store;

// Função para atualizar as configurações
export const setSettings = (newSettings: SettingsStore): void => {
  store.set(newSettings);
};

export const resetSettings = () => {
  store.clear(); // Limpa todos os dados da store
  console.log("Store limpa, aplicando configurações padrão...");

  // Agora definimos os valores padrão
  store.set(defaultSettings); // Define a configuração com os valores padrão
};
