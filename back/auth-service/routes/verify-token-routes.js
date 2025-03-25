// En tu archivo de rutas de autenticación
import express from 'express';
import { verifyTokenAdmin, verifyTokenUser } from '../controllers/authTokenController.js';

const router = express.Router();

// Ruta para verificar si el token es de admin
router.get('/is-admin', verifyTokenAdmin, (req, res) => {
  res.status(200).json({ 
    isAdmin: true,
    user: req.user 
  });
});

// Ruta para verificar si el token es de usuario
router.get('/is-user', verifyTokenUser, (req, res) => {
  res.status(200).json({ 
    isUser: true,
    user: req.user 
  });
});

export default router;