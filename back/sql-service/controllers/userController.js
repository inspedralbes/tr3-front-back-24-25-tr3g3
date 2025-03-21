// controllers/userController.js
import bcrypt from 'bcrypt';
import { User } from "../models/index.js";

export const createUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    let rol = 'cliente';

    const listAdmins = [
      'a20davsalsos@inspedralbes.cat',
      'a23izadelesp@inspedralbes.cat',
      'a23brioropoy@inspedralbes.cat',
      'a23marrojgon@inspedralbes.cat'
    ];

    if (listAdmins.includes(email)) rol = 'admin';

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ 
      email, 
      username, 
      password: hashedPassword, 
      rol,
      gold: 0,
      playTime: 0
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ where: { email } });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, username, password, rol, gold, playTime } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
    await user.update({ email, username, password: hashedPassword, rol, gold, playTime });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
