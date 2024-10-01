import express from "express";
import cors from "cors";
import cron from "node-cron"; // Import the node-cron package
import { router } from "./router";
import { Gbak } from "./Utils/MakeBackup";
import path from "path";
import { FileSender } from "./Utils/SendFiles";

const app = express();

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    origin: true,
  })
);

const sourceDB = path.join("C:", "Dados");
const backupDB = path.join("C:", "bkp");
const sender = new FileSender(
  backupDB,
  "C:/BackupAntonio",
  "n3",
  "187.19.216.31",
  "2890"
);

const gbak = new Gbak(sourceDB, backupDB);

// Schedule the backup to run every day at 8 AM
cron.schedule("* 8 * * *", async () => {
  try {
    console.log("Iniciando o backup diário...");

    // Execute backup
    await gbak.makeBackup(["TESTE"]);

    // Send files after backup
    await sender.sendFiles();

    console.log("Backup e envio de arquivos concluídos com sucesso.");
  } catch (error) {
    console.error(`Erro durante o backup: ${error.message}`);
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

// Example route
// app.get("/", (req, res) => {
//   res.send("Home Page");
// });

export { app };
