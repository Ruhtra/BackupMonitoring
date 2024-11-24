/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * A estrutura do diretório de build
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

// Tipagem do Electron no ambiente de renderização
interface Window {
  // A interface ipcRenderer pode ser personalizada para incluir funções específicas do seu aplicativo
  ipcRenderer: {
    // Tipagem dos métodos básicos do ipcRenderer
    on: (
      ...args: Parameters<typeof ipcRenderer.on>
    ) => ReturnType<typeof ipcRenderer.on>;
    off: (
      ...args: Parameters<typeof ipcRenderer.off>
    ) => ReturnType<typeof ipcRenderer.off>;
    send: (
      ...args: Parameters<typeof ipcRenderer.send>
    ) => ReturnType<typeof ipcRenderer.send>;
    invoke: (
      ...args: Parameters<typeof ipcRenderer.invoke>
    ) => ReturnType<typeof ipcRenderer.invoke>;

    // Função customizada para obter configurações
    getSettings: () => import("../electron/store").Settings; // Tipando a função `getSettings` com a importação de Settings
    setSettings: (newSettings: { theme: string; fontSize: number }) => void;

    openFileDialog: (type: "file" | "folder" | "any") => Promise<string[]>; // Função para abrir o diálogo de seleção de arquivos
  };
}
