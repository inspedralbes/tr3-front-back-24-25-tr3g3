import crypto from 'crypto';

const tokenStore = new Map();

const generateVerificationToken = (email) => {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const tokenBase = `${email}:${timestamp}:${randomBytes}`;
  return crypto.createHash('sha256').update(tokenBase).digest('hex');
};

const cleanupExpiredTokens = () => {
  const now = Date.now();
  for (const [token, data] of tokenStore.entries()) {
    if (now > data.expiresAt) {
      tokenStore.delete(token);
    }
  }
};

// Limpieza de tokens expirados cada 5 minutos (300000 ms)
setInterval(cleanupExpiredTokens, 300000);

/**
 * Crea un token de verificación para el usuario con los datos proporcionados.
 * El token tendrá una duración de 10 minutos.
 * @param {string} email - El correo electrónico del usuario.
 * @param {string} username - El nombre de usuario del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<string>} - El token generado.
 */
export const createToken = async (email, username, password) => {
  const token = generateVerificationToken(email);
  const expiresAt = Date.now() + 600000; // 10 minutos
  tokenStore.set(token, { email, username, password, expiresAt });
  return token;
};

/**
 * Crea un token para restablecer la contraseña del usuario.
 * El token tendrá una duración de 1 hora.
 * @param {string} email - El correo electrónico del usuario.
 * @returns {Promise<string>} - El token de restablecimiento de contraseña generado.
 */
export const createPasswordResetToken = async (email) => {
  const token = generateVerificationToken(email);
  const expiresAt = Date.now() + 3600000; // 1 hora
  tokenStore.set(token, { email, type: 'passwordReset', expiresAt });
  return token;
};

/**
 * Verifica si un token es válido. Si es válido, se elimina de la memoria después de la verificación.
 * @param {string} token - El token que se desea verificar.
 * @returns {Promise<Object|null>} - Los datos del token si es válido, o `null` si no es válido o ha expirado.
 */
export const verifyToken = async (token) => {
  const tokenData = tokenStore.get(token);
  if (tokenData && Date.now() <= tokenData.expiresAt) {
    tokenStore.delete(token); // Eliminar el token después de la verificación
    return tokenData;
  }
  return null;
};

/**
 * Obtiene los datos de un token, si existe.
 * @param {string} token - El token del cual se desean obtener los datos.
 * @returns {Promise<Object|null>} - Los datos del token, o `null` si no existe.
 */
export const getVerificationData = async (token) => {
  return tokenStore.get(token) || null;
};

/**
 * Elimina los tokens expirados de la memoria manualmente.
 * Esta función se puede ejecutar en cualquier momento para limpiar los tokens expirados.
 * @returns {Promise<void>} - No devuelve ningún valor.
 */
export const deleteExpiredTokens = async () => {
  cleanupExpiredTokens();
};
