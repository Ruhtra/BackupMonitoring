import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  getSettings: () => ipcRenderer.invoke("get-settings"), // Obtém as configurações do processo principal
  setSettings: (newSettings: { theme: string; fontSize: number }) =>
    ipcRenderer.invoke("set-settings", newSettings), // Envia novas configurações para o processo principal
  openFileDialog: (type: "file" | "folder" | "any") =>
    ipcRenderer.invoke("dialog:openFile", type),
  // You can expose other APTs you need here.
  // ...
});
