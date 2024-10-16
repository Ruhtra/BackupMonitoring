import { backupRoutineUseCase } from "./Application/BackupRoutineUseCase";
import { regGetAllUseCase } from "./Application/RegUseCase/RegGetAll";
import { env } from "./env";
import { app } from "./Presentation/App";
import { sendToClients } from "./Presentation/Middlewares/SseHandler";
import { server } from "./Presentation/Server";

console.log("> Running in mode:", env.NODE_ENV);

backupRoutineUseCase.execute({
  async Notify() {
    const regs = await regGetAllUseCase.execute();
    sendToClients(regs);
  },
});

server.start(app);
