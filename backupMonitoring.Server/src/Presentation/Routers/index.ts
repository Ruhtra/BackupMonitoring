import express from "express";
import path from "path";
import { eventsHandler } from "../Middlewares/SseHandler";
import { regGetAll } from "../Controllers/Reg/GetAll";
import { webHookStartBackup } from "../Controllers/WebHook/StartBackup";
import { webHookStartProccess } from "../Controllers/WebHook/StartProccess";
import { webHookFinishBackup } from "../Controllers/WebHook/FinishBackup";
import { webHookCreate } from "../Controllers/WebHook/Create";
import { WebHookStartSending } from "../Controllers/WebHook/StartSending/StartSending";
import { webHookStartSending } from "../Controllers/WebHook/StartSending";
import { webHookFinishSending } from "../Controllers/WebHook/FinishSending";
import { webHookFinishProccess } from "../Controllers/WebHook/FinishProccess";

const router = express.Router();

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Serve os arquivos estáticos gerados pelo Vite
router.use(express.static(path.join(__dirname, "../public")));

router.get("/api/events", use(eventsHandler));
router.get("/api/reg/GetAll", use(regGetAll.handle));

router.get(
  "*",
  use((req, res, next) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  })
);

router.post("/webhook/create", use(webHookCreate.handle));
router.post("/webhook/startProccess", use(webHookStartProccess.handle));

router.post("/webhook/startBackup", use(webHookStartBackup.handle));
router.post("/webhook/finishBackup", use(webHookFinishBackup.handle));

router.post("/webhook/startSending", use(webHookStartSending.handle));
router.post("/webhook/finishSending", use(webHookFinishSending.handle));

router.post("/webhook/FinishProccess", use(webHookFinishProccess.handle));

export { router };
