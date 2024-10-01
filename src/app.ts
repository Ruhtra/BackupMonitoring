import express from "express";
import cors from "cors";
import { router } from "./router";
import { LocalBackup } from "./Logic/LocalBackup";
import { RegService } from "./Service/RegService";

const app = express();

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    origin: true,
  })
);

// SSE clients array
const clients = [];

// Function to send a message to all connected clients
async function sendToClients() {
  const registros = await db.getAll(); // Obtém todos os registros do banco de dados
  clients.forEach((res) => {
    const data = JSON.stringify(registros);
    res.write(`data: ${data}\n\n`);
  });
}

// function sendToClients(message) {
//   clients.forEach((res) => {
//     res.write(`data: ${message}\n\n`);
//   });
// }

const db = new RegService();

// SSE endpoint
app.get("/events", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Add the client to the clients array
  clients.push(res);

  const registros = await db.getAll(); // Obtém todos os registros do banco de dados
  const data = JSON.stringify(registros);

  // Envia os dados como um evento
  res.write(`data: ${data}\n\n`);

  // Remove the client when connection closes
  req.on("close", () => {
    const index = clients.indexOf(res);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

new LocalBackup(sendToClients, db);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

export { app };
