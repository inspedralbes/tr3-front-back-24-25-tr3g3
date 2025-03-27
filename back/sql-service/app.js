import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js"; // Importamos Sequelize para garantizar la inicialización
import userRoutes from "./routes/user-routes.js";
import playerRoutes from "./routes/player-routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/user", userRoutes);
app.use("/players", playerRoutes);

// Función para iniciar el servidor solo si la DB está lista
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos verificada.");
    
    app.listen(PORT, () => {
      console.log(`🚀 Sql service corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer(); // Inicia el servidor solo si la conexión a la DB es exitosa
