import http from "http";
import { env } from "process";
import { backupFirebirdUseCase } from "./Application/BackupFirebird";

import { app } from "./Presentation/app";
import { sendToClients } from "./Presentation/Middlewares/SseHandler";
import { regGetAllUseCase } from "./Application/Reg/GetAll";

backupFirebirdUseCase.exeute({
  onUpdate: async () => {
    sendToClients(await regGetAllUseCase.exeute());
  },
});

http.createServer(app).listen(env.PORT, () => {
  console.log(" >. Server running in: http://localhost:" + env.PORT);
});
