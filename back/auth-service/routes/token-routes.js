const express = require('express');
import { generateToken, verifyToken } from './authTokenController.js';
const router = express.Router();

router.post('/login', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email es requerido' });
    }
    const token = generateToken(email);
    res.json({ token });
});

router.post('/verify', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token es requerido' });
    }
    const validation = verifyToken(token);
    if (!validation.valid) {
        return res.status(401).json(validation);
    }
    res.json(validation);
});

module.exports = router;
