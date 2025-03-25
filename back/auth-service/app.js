// IMPORTS Y USES -------------------------------------------------------------

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './googleService.js';
import session from 'express-session';
import authRouter from './routes/auth-route.js';
import tokenRouter from './routes/verify-token-routes.js';

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
app.use('/token', tokenRouter);

app.listen(PORT, () => {
  console.log(`🚀 Auth service funcionando en http://localhost:${PORT}`);
});

