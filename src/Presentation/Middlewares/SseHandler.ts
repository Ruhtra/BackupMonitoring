// src/Infra/SseHandler.ts
import { Response, Request } from "express";

let clients: Response[] = [];

export const eventsHandler = (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  clients.push(res);

  req.on("close", () => {
    const index = clients.indexOf(res);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
};

// Função para enviar dados a todos os clientes conectados
export const sendToClients = (data: any) => {
  const serializedData = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach((client) => client.write(serializedData));
};
