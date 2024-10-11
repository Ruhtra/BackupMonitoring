import express from "express";
import path from "path";
import { eventsHandler } from "../Middlewares/SseHandler";

const router = express.Router();

// Serve os arquivos estáticos gerados pelo Vite
router.use(express.static(path.join(__dirname, "../public")));

router.get("/api/events", eventsHandler);
router.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export { router };
