// routes/playerRoutes.js
import express from 'express';
import {
  createPlayer,
  getPlayers,
  getPlayerById,
  getPlayerByEmail,
  updatePlayerStats,
} from '../controllers/playerController.js';

const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { email, gold, timePlayed, health, damage, attackSpeed } = req.body;
    const player = await createPlayer(email, gold, timePlayed, health, damage, attackSpeed);
    res.status(201).json({ message: 'Jugador creado exitosamente', player });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear jugador', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const players = await getPlayers(); 

    if (!players || players.length === 0) {
      return res.status(404).json({ message: "No se encontraron jugadores" });
    }

    res.status(200).json(players);
  } catch (error) {
    console.error("❌ Error obteniendo jugadores:", error);
    res.status(500).json({ message: 'Error obteniendo jugadores', error: error.message });
  }
});



// Obtener jugador por ID
router.get('/:id', async (req, res) => {
  try {
    const player = await getPlayerById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }
    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el jugador', error: error.message });
  }
});

// Obtener jugador por email
router.get('/email/:email', async (req, res) => {
  try {
    const player = await getPlayerByEmail(req.params.email);
    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }
    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el jugador', error: error.message });
  }
});

// Actualizar estadísticas del jugador (sin modificar el email)
router.put('/:id/stats', async (req, res) => {
  try {
    const { gold, timePlayed, health, damage, attackSpeed } = req.body;
    const updatedStats = await updatePlayerStats(req.params.id, gold, timePlayed, health, damage, attackSpeed);
    res.status(200).json({ message: 'Estadísticas del jugador actualizadas exitosamente', updatedStats });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar las estadísticas del jugador', error: error.message });
  }
});

export default router;
