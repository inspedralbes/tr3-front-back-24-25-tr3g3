import 'dotenv/config';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL; // Definir la URL desde el .env

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extraer el token

    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/is-user`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Token inválido o expirado');
        }

        const data = await response.json();
        req.user = data.user; // Guardamos los datos del usuario en la solicitud
        next();
    } catch (error) {
        return res.status(403).json({ error: error.message });
    }
};

const verifyAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/is-admin`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Acceso restringido a administradores');
        }

        const data = await response.json();
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(403).json({ error: error.message });
    }
};

export { verifyToken, verifyAdmin };
