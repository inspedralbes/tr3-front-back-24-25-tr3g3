import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import dotenv from 'dotenv';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import * as userController from './controllers/userController.js';

dotenv.config();

const SQL_SERVICE_URL = process.env.SQL_SERVICE_URL;

async function findUserByMail(email) {
  const response = await fetch(`${SQL_SERVICE_URL}/user/email/${email}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en la solicitud');
  }
  return response.json();
}

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

        // Validate email exists in Google profile
        if (!profile.emails || !profile.emails[0]) {
          return done(new Error('No email found in Google profile'), null);
        }

        const email = profile.emails[0].value;

        // Busca un usuario existente por email usando el controlador
        let user = await findUserByMail(email);

        if (!user) {
          // Si el usuario no existe, crea uno nuevo con un password aleatorio
          const randomPassword = crypto.randomBytes(16).toString('hex');
          // Crea el usuario y obtiene el objeto resultante
          const response = await fetch(`${SQL_SERVICE_URL}/user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              username: profile.displayName,
              password: randomPassword
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          user = await response.json();
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
        const user = await findUserByMail(email);
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
