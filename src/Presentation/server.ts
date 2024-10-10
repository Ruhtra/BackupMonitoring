import http from "http";
import { env } from "process";

export class server {
  static start(app: any) {
    http.createServer(app).listen(env.PORT, () => {
      console.log(" >. Server running in: http://localhost:" + env.PORT);
    });
  }
}
