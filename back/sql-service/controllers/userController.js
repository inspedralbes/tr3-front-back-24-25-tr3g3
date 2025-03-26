import bcrypt from 'bcrypt';
import { User } from "../models/index.js";

const listAdmins = [
  'a20davsalsos@inspedralbes.cat',
  'a23izadelesp@inspedralbes.cat',
  'a23brioropoy@inspedralbes.cat',
  'a23marrojgon@inspedralbes.cat'
];

export const createUser = async (email, username, password) => {
  
  let rol = 'cliente';
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

  const userResponse = newUser.toJSON();
  delete userResponse.password;
  return userResponse;
};

export const getUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password'] }
  });
};

export const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ 
    where: { email },
  });
};

export const updateUser = async (id, userData) => {
  const user = await User.findByPk(id);
  
  if (!user) {
    throw new Error('User not found');
  }

  const hashedPassword = userData.password 
    ? await bcrypt.hash(userData.password, 10) 
    : user.password;

  await user.update({ 
    ...userData, 
    password: hashedPassword 
  });

  const updatedUser = user.toJSON();
  delete updatedUser.password;
  return updatedUser;
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  
  if (!user) {
    throw new Error('User not found');
  }

  await user.destroy();
  return { message: 'User deleted successfully' };
};

export const changePassword = async (id, userData) => {
  const user = await User.findByPk(id);
  
  if (!user) {
    throw new Error('User not found');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  await user.update({ password: hashedPassword });

  return { message: 'Password updated successfully' };
};