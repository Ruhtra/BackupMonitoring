/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
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
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Expõe a API do `ipcRenderer` com métodos personalizados, como `getSettings`
// no ambiente do Electron.
interface Window {
  ipcRenderer: {
    on: (...args: Parameters<typeof ipcRenderer.on>) => ReturnType<typeof ipcRenderer.on>;
    off: (...args: Parameters<typeof ipcRenderer.off>) => ReturnType<typeof ipcRenderer.off>;
    send: (...args: Parameters<typeof ipcRenderer.send>) => ReturnType<typeof ipcRenderer.send>;
    invoke: (...args: Parameters<typeof ipcRenderer.invoke>) => ReturnType<typeof ipcRenderer.invoke>;
    getSettings: () => import('../electron/store').Settings;  // Tipando a função `getSettings`
  };
}
