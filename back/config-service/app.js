import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import enemiesRouter from './routes/enemies.js'; 
import playerRouter from './routes/player.js'; 

const app = express();
const PORT = process.env.PORT; // 

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/config-enemies', enemiesRouter);
app.use('/config-players', playerRouter);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Config service en http://localhost:${PORT}`);
});
