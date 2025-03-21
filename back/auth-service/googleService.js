import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import dotenv from 'dotenv';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import * as userController from './controllers/userController.js';

dotenv.config();

/**
 * Adaptador para crear un usuario usando el controlador y obtener el objeto resultante.
 * Dado que la función createUser está pensada para Express (requiere req y res),
 * creamos un objeto "falso" que capture el JSON enviado.
 *
 * @param {string} email - Email del usuario
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña (sin hashear)
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario creado
 */
const createUserFromData = async (email, username, password) => {
  return new Promise((resolve, reject) => {
    const fakeReq = { body: { email, username, password } };
    const fakeRes = {
      status(code) {
        return this;
      },
      json(data) {
        resolve(data);
      }
    };
    userController
      .createUser(fakeReq, fakeRes)
      .catch(reject);
  });
};

/**
 * Estrategia de autenticación de Google OAuth.
 * Permite iniciar sesión con una cuenta de Google.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Busca un usuario existente por email usando el controlador
        let user = await userController.getUserByEmail(profile.emails[0].value);
        if (!user) {
          // Si el usuario no existe, crea uno nuevo con un password aleatorio
          const randomPassword = crypto.randomBytes(16).toString('hex');
          user = await createUserFromData(profile.emails[0].value, profile.displayName, randomPassword);
        }
        // Elimina la propiedad password del objeto usuario por seguridad
        delete user.password;
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/**
 * Estrategia de autenticación local.
 * Permite iniciar sesión con email y contraseña.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // Busca el usuario por email utilizando el controlador
        const user = await userController.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }
        // Compara la contraseña proporcionada con la almacenada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
        // Elimina la propiedad password por seguridad
        const userObj = { ...user };
        delete userObj.password;
        return done(null, userObj);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/**
 * Serializa el usuario para almacenarlo en la sesión.
 */
passport.serializeUser((user, done) => {
  done(null, user);
});

/**
 * Deserializa el usuario de la sesión.
 */
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
