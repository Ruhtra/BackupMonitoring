import express from "express";
import path from "path";
import { eventsHandler } from "../Middlewares/SseHandler";
import { regGetAll } from "../Controllers/Reg/GetAll";
import { webHookStartBackup } from "../Controllers/WebHook/StartBackup";
import { webHookStartProccess } from "../Controllers/WebHook/StartProccess";
import { webHookFailBackup } from "../Controllers/WebHook/FailBackup";
import { webHookSuccessBackup } from "../Controllers/WebHook/SuccessBackup";
import { webHookCreate } from "../Controllers/WebHook/Create";

const router = express.Router();

// Serve os arquivos estáticos gerados pelo Vite
router.use(express.static(path.join(__dirname, "../public")));

router.get("/api/events", eventsHandler);
router.get("/api/reg/GetAll", regGetAll.handle);

router.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.post("/webhook/create", webHookCreate.handle);
router.post("/webhook/startProccess", webHookStartProccess.handle);
router.post("/webhook/startBackup", webHookStartBackup.handle);
router.post("/webhook/failBackup", webHookFailBackup.handle);
router.post("/webhook/successBackup", webHookSuccessBackup.handle);

export { router };
