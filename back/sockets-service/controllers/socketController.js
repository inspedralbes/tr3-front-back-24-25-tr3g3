import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

let io;

const validateToken = async (token) => {
    try {
        const response = await fetch(process.env.API_VALIDATE_TOKEN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
        });

        if (!response.ok) {
            throw new Error('Failed to validate token');
        }

        const data = await response.json();
        return data.valid;
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
