import { Server } from "socket.io";
import axios from "axios"; // Para hacer la petición HTTP
import dotenv from "dotenv";

dotenv.config();

let io;

const validateToken = async (token) => {
    try {
        const response = await axios.post(process.env.API_VALIDATE_TOKEN, { token });
        return response.data.valid; // Suponiendo que la API responde con { valid: true/false }
    } catch (error) {
        console.error("Error validando el token:", error);
        return false;
    }
};

export const initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: "*" }
    });

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            console.log("❌ Conexión rechazada: Falta token");
            return next(new Error("Falta token de autenticación"));
        }

        const isValid = await validateToken(token);
        if (!isValid) {
            console.log("❌ Conexión rechazada: Token inválido");
            return next(new Error("Token inválido"));
        }

        next(); // Permite la conexión
    });

    io.on("connection", (socket) => {
        console.log(`✅ Cliente conectado: ${socket.id}`);

        socket.on("message", (data) => {
            console.log(`📩 Mensaje recibido: ${data}`);
            io.emit("message", `Echo: ${data}`);
        });

        socket.on("disconnect", () => {
            console.log(`❌ Cliente desconectado: ${socket.id}`);
        });
    });
};

export const getIo = () => {
    if (!io) throw new Error("Socket.io no ha sido inicializado");
    return io;
};
