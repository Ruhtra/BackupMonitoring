import http from "http";

import { app } from "./app";
import { env } from "./env";

async function initModules() {
  console.log(" ~. Starting modules...");

  http.createServer(app).listen(env.PORT, () => {
    console.log(" >. Server running in: http://localhost:" + env.PORT);
  });
}

initModules();
