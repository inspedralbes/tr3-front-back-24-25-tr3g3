import { Router } from 'express';
import MongoDBController from '../controllers/mongoDBcontroller.js';

const router = Router();

// Middleware para conexión MongoDB
router.use(async (req, res, next) => {
  try {
    if (!MongoDBController.db) {
      await MongoDBController.connect();
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error de conexión con MongoDB' });
  }
});

// ================== RUTA PARA ENEMIGOS PARA UNITY ==================
router.get('/unity/enemies', async (req, res) => {
  try {
    const enemiesUnity = await MongoDBController.getEnemysforUnity();
    res.json(enemiesUnity);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo enemigos para Unity' });
  }
});

// ================== RUTAS PARA ENEMIGOS ==================
router.route('/enemies')
  .get(async (req, res) => {
    try {
      const enemies = await MongoDBController.getAllEnemies();
      res.json(enemies);
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo enemigos' });
    }
  })
  .post(async (req, res) => {
    try {
      const result = await MongoDBController.createEnemy(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: 'Error creando enemigo' });
    }
  });

router.route('/enemies/:id')
  .get(async (req, res) => {
    try {
      const enemy = await MongoDBController.getEnemy(req.params.id);
      enemy ? res.json(enemy) : res.status(404).json({ error: 'Enemigo no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo enemigo' });
    }
  })
  .put(async (req, res) => {
    try {
      const result = await MongoDBController.updateEnemy(req.params.id, req.body);
      result.modifiedCount > 0 
        ? res.json({ message: 'Enemigo actualizado' })
        : res.status(404).json({ error: 'Enemigo no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error actualizando enemigo' });
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await MongoDBController.deleteEnemy(req.params.id);
      result.deletedCount > 0 
        ? res.json({ message: 'Enemigo eliminado' })
        : res.status(404).json({ error: 'Enemigo no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error eliminando enemigo' });
    }
  });

// ================== RUTAS PARA DIFICULTADES ==================
router.route('/difficulties')
  .get(async (req, res) => {
    try {
      const difficulties = await MongoDBController.getAllDifficulties();
      res.json(difficulties);
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo dificultades' });
    }
  });

router.route('/difficulties/:id')
  .get(async (req, res) => {
    try {
      const difficulty = await MongoDBController.getDifficulty(req.params.id);
      difficulty ? res.json(difficulty) : res.status(404).json({ error: 'Dificultad no encontrada' });
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo dificultad' });
    }
  });

router.put('/difficulties/:id/quantities', async (req, res) => {
  try {
    const result = await MongoDBController.updateDifficultyQuantities(
      req.params.id,
      req.body.enemies
    );
    result.modifiedCount > 0 
      ? res.json({ message: 'Cantidades actualizadas' })
      : res.status(404).json({ error: 'Dificultad no encontrada' });
  } catch (error) {
    res.status(400).json({ error: 'Error actualizando cantidades' });
  }
});

export default router;
