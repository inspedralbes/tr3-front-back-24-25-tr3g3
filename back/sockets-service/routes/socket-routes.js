import { Router } from "express";
import { getIo } from "../controllers/socketController.js";

const router = Router();

// Ruta de prueba para emitir un evento
router.get("/test", (req, res) => {
    try {
        const io = getIo();
        io.emit("message", "🔵 Mensaje desde la API");
        res.json({ message: "📡 Mensaje enviado por WebSockets" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
