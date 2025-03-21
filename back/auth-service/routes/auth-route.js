import express from 'express';
import passport from 'passport';
import { createUser, getUserByEmail, changePassword } from '../controllers/userController.js';
import { createToken, verifyToken, createPasswordResetToken } from '../controllers/verifyTokenController.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../emailService.js';

const router = express.Router();

// LOGIN CON EMAIL Y CONTRASEÑA
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor', error: err.message });
        if (!user) return res.status(401).json({ message: 'Credenciales incorrectas', details: info });

        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
            res.status(200).json({ redirectUrl: `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/callback?user=${encodeURIComponent(JSON.stringify(req.user))}` });
        });
    })(req, res, next);
});

// LOGIN CON GOOGLE
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/callback?user=${encodeURIComponent(JSON.stringify(req.user))}`);
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
        const existingUser = await getUserByEmail(email);
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
        const user = await getUserByEmail(email);
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

        const existingUser = await getUserByEmail(verificationData.email);
        if (existingUser) return res.status(400).json({ message: "El usuario ya existe." });

        await createUser({ body: verificationData }, res);
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

        const user = await getUserByEmail(tokenData.email);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

        req.params.id = user.id;
        req.body.password = newPassword;
        await changePassword(req, res);
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).json({ message: "Error al restablecer la contraseña." });
    }
});

export default router;
