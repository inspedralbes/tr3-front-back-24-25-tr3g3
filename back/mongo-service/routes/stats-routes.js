import { Router } from 'express';
import StatsController from '../controllers/statsController.js';

const router = Router();

// Middlewares de validación
const validateEmail = (req, res, next) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(req.params.email)) {
        return res.status(400).json({ 
            error: 'Formato de email inválido',
            ejemplo: 'usuario@dominio.com'
        });
    }
    next();
};

const validateDate = (req, res, next) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(req.params.date)) {
        return res.status(400).json({ 
            error: 'Formato de fecha inválido', 
            formato_requerido: 'YYYY-MM-DD'
        });
    }
    next();
};

// Middleware para validar conexión con MongoDB
router.use(async (req, res, next) => {
    try {
        if (!StatsController.db) {
            return res.status(503).json({ 
                error: 'Base de datos no disponible',
                solucion: 'Verificar conexión con MongoDB'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ 
            error: 'Error crítico de conexión',
            detalle: error.message
        });
    }
});

// Endpoints principales
router.get('/stats', async (req, res) => {
    try {
        const stats = await StatsController.getAllStats();
        res.json({
            count: stats.length,
            data: stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error interno al obtener estadísticas',
            debug_id: `ERR-${Date.now()}`
        });
    }
});

// Obtener estadísticas por email
router.get('/stats/email/:email', validateEmail, async (req, res) => {
    try {
        const stats = await StatsController.getStatsByEmail(req.params.email);
        
        if (stats.length === 0) {
            return res.status(404).json({
                error: 'No se encontraron registros',
                email: req.params.email
            });
        }
        
        res.json({
            email: req.params.email,
            registros: stats.length,
            rango_fechas: {
                inicio: stats[0].fecha,
                fin: stats[stats.length - 1].fecha
            },
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error en consulta por email',
            debug_info: `QUERY_EMAIL_${req.params.email.slice(0, 3)}***`
        });
    }
});

// Obtener estadísticas por fecha
router.get('/stats/date/:date', validateDate, async (req, res) => {
    try {
        const stats = await StatsController.getStatsByDate(req.params.date);
        
        if (stats.length === 0) {
            return res.status(404).json({
                error: 'Fecha sin registros',
                fecha: req.params.date,
                sugerencia: 'Verificar formato YYYY-MM-DD'
            });
        }
        
        res.json({
            fecha: req.params.date,
            usuarios_unicos: [...new Set(stats.map(s => s.email))].length,
            registros: stats.length,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error en consulta por fecha',
            fecha_solicitada: req.params.date
        });
    }
});

// Endpoint combinado con query parameters
router.get('/stats/filter', async (req, res) => {
    try {
        const { email, date } = req.query;
        let results;

        if (email && date) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return res.status(400).json({ error: 'Formato de fecha inválido' });
            }
            
            const [emailStats, dateStats] = await Promise.all([
                StatsController.getStatsByEmail(email),
                StatsController.getStatsByDate(date)
            ]);
            
            results = emailStats.filter(stat => 
                dateStats.some(dStat => dStat._id.toString() === stat._id.toString())
            );
        } else if (email) {
            results = await StatsController.getStatsByEmail(email);
        } else if (date) {
            results = await StatsController.getStatsByDate(date);
        } else {
            return res.status(400).json({ 
                error: 'Parámetros insuficientes',
                parametros_validos: ['email', 'date']
            });
        }

        if (results.length === 0) {
            return res.status(404).json({ 
                error: 'Criterio sin resultados',
                parametros_usados: { email, date }
            });
        }

        res.json({
            parametros: { email, date },
            registros: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error en filtro combinado',
            sistema: 'Query parameters handler'
        });
    }
});

// CRUD Original

// Obtener estadística por ID
router.get('/stats/:id', async (req, res) => {
    try {
        const stat = await StatsController.getStatById(req.params.id);
        if (!stat) {
            return res.status(404).json({ 
                error: 'Registro no encontrado',
                id_solicitado: req.params.id
            });
        }
        res.json(stat);
    } catch (error) {
        res.status(500).json({ 
            error: 'Error en búsqueda por ID',
            id_formato_requerido: 'ObjectId válido'
        });
    }
});

// Crear una nueva estadística
router.post('/stats', async (req, res) => {
  try {
      const { email, fecha, estadisticas } = req.body;

      // Validar datos enviados
      if (
          !email || !fecha || !estadisticas ||
          typeof estadisticas.ghost_killed !== "number" ||
          typeof estadisticas.grunt_killed !== "number" ||
          typeof estadisticas.horse_killed !== "number" ||
          typeof estadisticas.ogre_killed !== "number" ||
          typeof estadisticas.wolf_killed !== "number" ||
          typeof estadisticas.boss_killed !== "number"
      ) {
          return res.status(400).json({
              error: "Modelo incorrecto",
              ejemplo: {
                  email: "usuario@dominio.com",
                  fecha: "2025-04-01",
                  estadisticas: {
                      ghost_killed: 0,
                      grunt_killed: 0,
                      horse_killed: 0,
                      ogre_killed: 0,
                      wolf_killed: 0,
                      boss_killed: 0
                  }
              }
          });
      }

      // Crear la nueva estadística
      const result = await StatsController.createStat({
          email,
          fecha,
          estadisticas
      });

      // Responder con éxito
      res.status(201).json({
          mensaje: "Estadística creada exitosamente",
          id_asignado: result.insertedId,
          datos_creados: {
              email,
              fecha,
              estadisticas
          },
          ubicacion: `/stats/${result.insertedId}`
      });
  } catch (error) {
      console.error("Error al crear la estadística:", error);
      res.status(500).json({
          error: "Error interno al crear la estadística",
          detalle: error.message
      });
  }
});

export default router;