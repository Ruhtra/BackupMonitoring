import express from "express";
import path from "path";
import { eventsHandler } from "../Middlewares/SseHandler";

const router = express.Router();

router.get("/events", eventsHandler);
router.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export { router };
