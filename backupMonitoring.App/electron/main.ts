import { app, BrowserWindow, dialog, ipcMain, Menu, Tray } from "electron";
// import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  defaultSettings,
  getSettings,
  setSettings,
  SettingsStore,
  store,
} from "./store";

import { BackupUseCase } from "backupmonitoring.backup/src/main";

// const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let isQuiting = false;

// Função para verificar se é a primeira execução
const isFirstExecution = (): boolean => {
  const firstRun = store.get("firstRun", true); // Verifica se 'firstRun' é true
  if (firstRun) {
    store.set("firstRun", false); // Marca como não sendo a primeira execução
    return true; // Indica que é a primeira execução
  }
  return false; // Não é a primeira execução
};

// Função para definir configurações iniciais se for a primeira execução
const initializeSettings = () => {
  if (isFirstExecution()) {
    // Se for a primeira execução, define as configurações padrão
    store.set(defaultSettings);
  } else {
    // Se não for a primeira execução, as configurações já estão salvas
    console.log("Settings already exist, no need to reset.");
  }
};

function createWindow() {
  console.log("create window");

  const a = new BackupUseCase("0 0 * * * *");
  a.execute();

  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    width: 400,
    height: 600,
    show: false,
  });

  // Inicializar as configurações
  initializeSettings();

  // Defina a comunicação IPC
  ipcMain.handle("get-settings", () => getSettings()); // Quando o renderer pedir as configurações
  ipcMain.handle("set-settings", (_event, newSettings: SettingsStore) =>
    setSettings(newSettings)
  ); // Quando o renderer enviar novas configurações
  ipcMain.handle(
    "dialog:openFile",
    async (_event, type: "file" | "folder" | "any") => {
      if (type === "file") {
        const result = await dialog.showOpenDialog({
          properties: ["openFile"], // Permite selecionar arquivos e pastas
          filters: [
            {
              name: "Firebird File (.FDB)",
              extensions: ["fdb", "FDB"], // Filtrando para arquivos com extensões relacionadas ao SSH
            },
          ],
        });
        return result.filePaths;
      } else if (type == "folder") {
        const result = await dialog.showOpenDialog({
          properties: ["openFile", "openDirectory"], // Permite selecionar arquivos e pastas
        });
        return result.filePaths;
      } else if (type == "any") {
        const result = await dialog.showOpenDialog({
          properties: ["openFile"], // Permite selecionar arquivos e pastas
        });
        return result.filePaths;
      }
    }
  );

  // const settings = getSettings();  // Obtém as configurações
  // console.log(settings);  // Mostra as configurações no console

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  //Carrega na bandeja do windows
  const tray = new Tray(
    path.join(process.env.VITE_PUBLIC, "electron-vite.png")
  );
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Abrir configurações",
      click: () => {
        win?.show();
      },
    },
    {
      label: "Fechar",
      click: () => {
        isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Aplicação de backup");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    win?.isVisible() ? win.hide() : win?.show();
  });

  win.on("close", (e) => {
    if (!isQuiting) {
      e.preventDefault();
      win?.hide();
    }
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
