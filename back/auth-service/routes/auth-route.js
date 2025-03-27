// auth-route.js
import express from 'express';
import passport from 'passport';
import crypto from 'crypto';
import { UserRepository } from '../repositories/userRepository.js';
import { createToken, verifyToken, createPasswordResetToken } from '../controllers/verifyTokenController.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../emailService.js';
import { generateJWToken, verifyTokenAdmin, verifyTokenUser } from '../controllers/authTokenController.js';

const router = express.Router();

// LOGIN CON EMAIL Y CONTRASEÑA
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor', error: err.message });
        if (!user) return res.status(401).json({ message: 'Credenciales incorrectas', details: info });

        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
            
            // Generar token JWT para el usuario
            try {
                // Determinar el rol del usuario (ajusta según tu estructura de datos)
                const rol = user.rol || 'cliente'; // Por defecto asigna 'cliente' si no tiene rol
                
                // Datos a incluir en el token (elimina datos sensibles)
                const tokenData = {
                    id: user.id,
                    email: user.email,
                    username: user.username
                };
                
                const token = generateJWToken(tokenData, rol);
                
                // Enviar el token al cliente
                res.status(200).json({ 
                    message: 'Login exitoso',
                    token: token,
                    user: tokenData
                });
            } catch (error) {
                return res.status(500).json({ message: 'Error al generar token', error: error.message });
            }
        });
    })(req, res, next);
});

router.post('/unity/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        
        // Validación básica de campos
        if (!email || !username || !password) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        // Crear el objeto exacto que la API espera
        const userData = {
            email,
            username,
            password
        };

        // Conexión con API externa
        const respuestaAPI = await fetch(process.env.UNITY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const datos = await respuestaAPI.json();

        if (!respuestaAPI.ok) {
            return res.status(respuestaAPI.status).json(datos);
        }

        res.status(201).json(datos);
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: error.message 
        });
    }
});

// LOGIN CON GOOGLE
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    try {
        const user = req.user;

        // Determinar el rol del usuario (ajusta según tu estructura de datos)
        const rol = user.rol || 'cliente'; // Por defecto asigna 'cliente' si no tiene rol

        // Datos a incluir en el token (elimina datos sensibles)
        const tokenData = {
            id: user.id,
            email: user.email,
            username: user.username
        };

        const token = generateJWToken(tokenData, rol);

        // Redirige al frontend con el token como parámetro de URL
        res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/callback?user=${encodeURIComponent(JSON.stringify(req.user))}&token=${token}`);
    } catch (error) {
        console.error('Error al generar token:', error);
        res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/error?message=${encodeURIComponent('Error al generar token')}`);
    }
});

// CERRAR SESIÓN
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}`);
    });
});

// EMAILS
router.post('/send-verification-email', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email) return res.status(400).json({ message: "El correo electrónico es requerido." });

    try {
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) return res.status(400).json({ message: "El usuario ya existe." });

        const token = await createToken(email, username, password);
        const link = `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/verify-register?token=${token}`;

        await sendVerificationEmail(email, link);
        res.status(200).json({ message: `Correo de verificación enviado a ${email}` });
    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
        res.status(500).json({ message: "Hubo un error al enviar el correo de verificación." });
    }
});

router.post('/send-password-reset-email', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "El correo electrónico es requerido." });

    try {
        const user = await UserRepository.findByEmail(email);
        if (!user) return res.status(400).json({ message: "No se encontró un usuario con ese correo electrónico." });

        const token = await createPasswordResetToken(email);
        const link = `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/reset-password?token=${token}`;

        await sendPasswordResetEmail(email, link);
        res.status(200).json({ message: `Correo para restablecer contraseña enviado a ${email}` });
    } catch (error) {
        console.error('Error al enviar el correo para restablecer contraseña:', error);
        res.status(500).json({ message: "Hubo un error al enviar el correo para restablecer la contraseña." });
    }
});

// VERIFICACIÓN DE EMAIL
router.post('/verify-email/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const verificationData = await verifyToken(token);
        if (!verificationData) return res.status(400).json({ message: "Token inválido o expirado." });

        const existingUser = await UserRepository.findByEmail(verificationData.email);
        if (existingUser) return res.status(400).json({ message: "El usuario ya existe." });

        await UserRepository.createUser({ body: verificationData }, res);
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(500).json({ message: "Error al verificar el token." });
    }
});

// RESTABLECER CONTRASEÑA
router.post('/reset-password/:token', async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.params;

    if (!token || !newPassword) return res.status(400).json({ message: "Token y nueva contraseña son requeridos." });

    try {
        const tokenData = await verifyToken(token);
        if (!tokenData) return res.status(400).json({ message: "Token inválido o expirado." });

        const user = await UserRepository.findByEmail(tokenData.email);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

        await UserRepository.changePassword(user.id, newPassword);
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).json({ message: "Error al restablecer la contraseña." });
    }
});

export default router;
