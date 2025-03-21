// routes/userRoutes.js
import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  changePassword,
} from '../controllers/userController.js';

const router = express.Router();

// Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await createUser(email, username, password);
    res.status(201).json({ message: 'Usuario creado exitosamente', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
});

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
});

// Obtener usuario por email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
});

// Actualizar usuario por ID
router.put('/:id', async (req, res) => {
  try {
    const { email, username, password, rol } = req.body;
    const updatedUser = await updateUser(req.params.id, email, username, password, rol);
    res.status(200).json({ message: 'Usuario actualizado exitosamente', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
});

// Eliminar usuario por ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    if (result) {
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
});

// Cambiar la contraseña de un usuario
router.put('/:id/password', async (req, res) => {
  try {
    const { password } = req.body;
    const updatedPassword = await changePassword(req.params.id, password);
    res.status(200).json({ message: 'Contraseña actualizada exitosamente', updatedPassword });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la contraseña', error: error.message });
  }
});

export default router;
