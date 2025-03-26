// /controllers/authTokenController.js
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;
const JWT_SECRET_USER = process.env.JWT_SECRET_USER;


function generateJWToken(data, rol){
    switch (rol) {
        case 'admin':
            return jwt.sign(data, JWT_SECRET_ADMIN, { expiresIn: '3h' });
        case 'cliente':
            return jwt.sign(data, JWT_SECRET_USER, { expiresIn: '3h' });
        default:
            throw new Error('Rol no válido');
    }
}

function verifyToken(secrets) {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1]; // Leer el token del encabezado "Authorization"

        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        for (const secret of secrets) {
            try {
                const decoded = jwt.verify(token, secret); // Intentar verificar el token
                req.user = decoded; // Agregar los datos del usuario decodificado al objeto de solicitud
                return next(); // Token válido
            } catch (error) {
                // Continuar intentando con otros secretos
            }
        }

        return res.status(403).json({ message: 'Token inválido o expirado' }); // Ningún secreto válido
    };
}
const verifyTokenAdmin = verifyToken([JWT_SECRET_ADMIN]);
const verifyTokenUser = verifyToken([JWT_SECRET_ADMIN, JWT_SECRET_USER]);

export { generateJWToken, verifyTokenAdmin, verifyTokenUser };