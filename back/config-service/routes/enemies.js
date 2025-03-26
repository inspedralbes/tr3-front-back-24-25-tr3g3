import express from 'express';
import 'dotenv/config';
import { verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();
const API_URL = process.env.API_URL_ENEMIES;

// Función auxiliar para hacer peticiones a la API de jugadores
const makeRequest = async (method, path, body = null) => {
    const url = `${process.env.API_URL_ENEMIES}${path}`;
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

router.get('/enemies/boss', async (req, res) => {
    try {
        const bossEnemy = await makeRequest('GET', '/enemies/boss');
        res.status(200).json(bossEnemy);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error obteniendo enemigos boss', 
            error: error.message 
        });
    }
});

// 🔒 Todas las rutas de enemigos requieren ser Admin

router.get('/unity/enemies', async (req, res) => {
    try {
        const enemiesUnity = await makeRequest('GET', '/unity/enemies');
        res.status(200).json(enemiesUnity);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo enemigos para Unity', error: error.message });
    }
});

router.post('/enemies', verifyAdmin, async (req, res) => {
    try {
        const result = await makeRequest('POST', '/enemies', req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error creando enemigo', error: error.message });
    }
});

router.get('/enemies', verifyAdmin, async (req, res) => {
    try {
        const enemies = await makeRequest('GET', '/enemies');
        res.status(200).json(enemies);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo enemigos', error: error.message });
    }
});

router.get('/enemies/:id', verifyAdmin, async (req, res) => {
    try {
        const enemy = await makeRequest('GET', `/enemies/${req.params.id}`);
        res.status(200).json(enemy);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo enemigo', error: error.message });
    }
});

router.put('/enemies/:id', verifyAdmin, async (req, res) => {
    try {
        const result = await makeRequest('PUT', `/enemies/${req.params.id}`, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando enemigo', error: error.message });
    }
});

router.delete('/enemies/:id', verifyAdmin, async (req, res) => {
    try {
        const result = await makeRequest('DELETE', `/enemies/${req.params.id}`);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando enemigo', error: error.message });
    }
});

// Nueva ruta para buscar por 'boss'
router.get('/enemies/boss', verifyAdmin, async (req, res) => {
    const { boss } = req.query;  // Parámetro de consulta para buscar por boss

    if (!boss) {
        return res.status(400).json({ message: 'El parámetro "boss" es requerido' });
    }

    try {
        const enemies = await makeRequest('GET', `/enemies?boss=${boss}`);
        res.status(200).json(enemies);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo enemigos', error: error.message });
    }
});

export default router;
