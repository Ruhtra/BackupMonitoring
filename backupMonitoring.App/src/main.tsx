import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";

import "./index.css";
import { BrowserRouter, Route, Link } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </React.StrictMode>,
);

// // Use contextBridge
// window.ipcRenderer.on('main-process-message', (_event, message) => {
//   console.log(message)
// })

console.log(await window.ipcRenderer.getSettings());
