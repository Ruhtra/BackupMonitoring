import express from "express";
import cors from "cors";
import { router } from "./Routers";
import { Response, Request } from "express";
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

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  const message = err.message || "Something went wrong!";

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Optionally send the stack in development mode
    },
  });
});

export { app };
