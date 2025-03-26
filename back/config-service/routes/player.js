import express from 'express';
import 'dotenv/config';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Función auxiliar para hacer peticiones a la API de jugadores
const makeRequest = async (method, path, body = null) => {
    const url = `${process.env.API_URL_PLAYERS}${path}`;
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
    }

    return data;
};

// 🔥 RUTAS GENERALES DE JUGADORES
router.get('/players', verifyToken, async (req, res) => {
    try {
        const players = await makeRequest('GET', '/players');
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo jugadores', error: error.message });
    }
});

router.get('/players/:id', verifyToken, async (req, res) => {
    try {
        const player = await makeRequest('GET', `/players/${req.params.id}`);
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo jugador', error: error.message });
    }
});

router.get('/players/email/:email', verifyToken, async (req, res) => {
    try {
        const player = await makeRequest('GET', `/players/email/${req.params.email}`);
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo jugador por email', error: error.message });
    }
});

router.post('/players', verifyToken, async (req, res) => {
    try {
        const { email, gold, timePlayed, health, damage, attackSpeed } = req.body;
        const player = await makeRequest('POST', '/players', { email, gold, timePlayed, health, damage, attackSpeed });
        res.status(201).json({ message: 'Jugador creado exitosamente', player });
    } catch (error) {
        res.status(500).json({ message: 'Error creando jugador', error: error.message });
    }
});

// 🔧 RUTA PARA ACTUALIZAR TODAS LAS ESTADÍSTICAS DEL JUGADOR
router.put('/players/:id/stats', verifyToken, async (req, res) => {
    try {
        const { gold, timePlayed, health, damage, attackSpeed } = req.body;
        const updatedStats = await makeRequest('PUT', `/players/${req.params.id}/stats`, {
            gold,
            timePlayed,
            health,
            damage,
            attackSpeed,
        });
        res.status(200).json({ message: 'Estadísticas actualizadas correctamente', updatedStats });
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando estadísticas', error: error.message });
    }
});

// 🔧 RUTAS PARA ACTUALIZAR CADA ESTADÍSTICA INDIVIDUALMENTE
const stats = ['gold', 'timePlayed', 'health', 'damage', 'attackSpeed'];

stats.forEach(stat => {
    router.put(`/players/:id/stats/${stat}`, verifyToken, async (req, res) => {
        try {
            const value = req.body[stat];
            if (value === undefined) {
                return res.status(400).json({ message: `El campo ${stat} es requerido` });
            }

            const updatedStat = await makeRequest('PUT', `/players/${req.params.id}/stats/${stat}`, { [stat]: value });
            res.status(200).json({ message: `${stat} actualizado correctamente`, updatedStat });
        } catch (error) {
            res.status(500).json({ message: `Error actualizando ${stat}`, error: error.message });
        }
    });
});

export default router;
