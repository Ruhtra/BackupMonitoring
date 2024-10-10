import { backupRoutineUseCase } from "./Application/BackupRoutineUseCase";
import { regGetAllUseCase } from "./Application/RegUseCase/RegGetAll";
import { app } from "./Presentation/App";
import { sendToClients } from "./Presentation/Middlewares/SseHandler";
import { server } from "./Presentation/Server";

backupRoutineUseCase.execute({
  async Notify() {
    const regs = await regGetAllUseCase.execute();
    sendToClients(regs);
  },
});

server.start(app);
