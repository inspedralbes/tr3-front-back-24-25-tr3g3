import express from 'express';
import 'dotenv/config';

const router = express.Router();
const API_URL = process.env.API_URL_PLAYERS; 


const makeRequest = async (method, path) => {
    const url = `http://localhost:3005${path}`;
    console.log(`🔍 Haciendo solicitud a: ${url}`);
    
    const response = await fetch(url, { method });
    
    const text = await response.text();
    console.log(`🔍 Respuesta recibida: ${text}`);

    return JSON.parse(text);
};


router.get('/players', async (req, res) => {
    try {
        const players = await makeRequest('GET', '/player');
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo jugadores', error: error.message });
    }
});


router.get('/players/:id', async (req, res) => {
    try {
        const player = await makeRequest('GET', `/players/${req.params.id}`);
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo jugador', error: error.message });
    }
});

router.get('/players/email/:email', async (req, res) => {
    try {
        const player = await makeRequest('GET', `/players/email/${req.params.email}`);
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo jugador por email', error: error.message });
    }
});

router.put('/players/:id/stats', async (req, res) => {
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
        res.status(500).json({ message: 'Error actualizando estadísticas del jugador', error: error.message });
    }
});

router.post('/players', async (req, res) => {
    try {
        const { email, gold, timePlayed, health, damage, attackSpeed } = req.body;
        const player = await makeRequest('POST', '/players', {
            email,
            gold,
            timePlayed,
            health,
            damage,
            attackSpeed,
        });
        res.status(201).json({ message: 'Jugador creado exitosamente', player });
    } catch (error) {
        res.status(500).json({ message: 'Error creando jugador', error: error.message });
    }
});

export default router;
