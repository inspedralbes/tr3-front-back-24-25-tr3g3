// IMPORTS Y USES -------------------------------------------------------------

import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import passport from './googleService.js';
import session from 'express-session';
import { sequelize } from './models/index.js';
import authRouter from './routes/auth-route.js';
import enemiesRouter from './routes/enemies.js'
import MongoDBController from './controllers/mongoDBcontroller.js';

// Configuración de rutas y directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT;

// Configuración del servidor
const app = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Configuración de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'clave-secreta',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000, httpOnly: true, sameSite: 'lax' },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Middleware para proteger rutas
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'No autorizado' });
}

// Middleware para verificar si el usuario es administrador
function isAdmin() {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
      return next();
    }
    res.status(403).json({ message: `Acceso denegado: se requiere rol admin` });
  };
}               

app.use('/auth', authRouter);

// Sincronización de las bases de datos
Promise.all([
  sequelize.sync(),
  MongoDBController.connect()
])
.then(() => {
  console.log('✅ Bases de datos SQL y MongoDB sincronizadas correctamente.');
  app.listen(PORT, () => {
    console.log(`🚀 Auth service funcionando en http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ Error sincronizando las bases de datos:', err);
  process.exit(1);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❗ Promesa no manejada:', reason);
  // Aplicación específica de manejo de errores
});

process.on('uncaughtException', (error) => {
  console.error('❗ Excepción no capturada:', error);
  // Aplicación específica de manejo de errores
  process.exit(1);
});
