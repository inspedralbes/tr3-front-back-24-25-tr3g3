import { Router } from "express";
import dotenv from "dotenv";
import { getIo } from "../controllers/socketController.js";

dotenv.config();

const router = Router();

// Ruta para obtener información y enviarla a todos los clientes
router.get("/broadcast", async (req, res) => {
    try {
        const io = getIo();
        const response = await fetch(process.env.API_BROADCAST_DATA);
        const data = await response.json();

        io.emit("broadcast", data); // Enviar la información a todos los clientes

        res.json({ message: "📡 Información enviada a los clientes", data });
    } catch (error) {
        console.error("❌ Error al obtener datos:", error);
        res.status(500).json({ error: "Error al obtener información" });
    }
});

export default router;
