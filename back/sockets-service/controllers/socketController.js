import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: "*" } 
    });

    io.on("connection", (socket) => {
        console.log(`✅ Cliente conectado: ${socket.id}`);

        // Evento de prueba
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
