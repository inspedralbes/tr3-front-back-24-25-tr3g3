import express from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import { initSocket } from "./controllers/socketController.js";
import socketRoutes from "./routes/socket-routes.js";

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/socket", socketRoutes);

// Iniciar Socket.io
initSocket(server);

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`🚀 Sockets service corriendo en http://localhost:${PORT}`);
});
