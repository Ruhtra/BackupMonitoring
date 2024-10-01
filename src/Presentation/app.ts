import express from "express";
import cors from "cors";
import { router } from "./Router";
// import { RegLocalRepository } from "../Domain/Repositories/RegLocalRepository";
// import { backupFirebirdUseCase } from "../Application/BackupFirebird";
// import { regGetAllUseCase } from "../Application/Reg/GetAll";
// import { sendToClients } from "./Middlewares/SseHandler";

const app = express();

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    origin: true,
  })
);

// backupFirebirdUseCase.exeute({
//   cb: async () => {
//     sendToClients(await regGetAllUseCase.exeute());
//   },
// });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

export { app };
