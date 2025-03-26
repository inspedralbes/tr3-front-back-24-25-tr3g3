// controllers/playerController.js
import { Player } from "../models/index.js";
import { getUserByEmail } from "./userController.js"; 

// Crear un jugador
export const createPlayer = async (email, gold, timePlayed, health, damage, attackSpeed) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found for the given email");
    }

    const newPlayer = await Player.create({
      email,
      gold,
      timePlayed,
      health,
      damage,
      attackSpeed,
    });

    return newPlayer;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obtener todos los jugadores
export const getPlayers = async () => {
  try {
    return await Player.findAll();
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obtener jugador por ID
export const getPlayerById = async (id) => {
  try {
    return await Player.findByPk(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obtener jugador por email
export const getPlayerByEmail = async (email) => {
  try {
    return await Player.findOne({ where: { email } });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Actualizar estadísticas del jugador (usando solo un método)
export const updatePlayer = async (id, gold, timePlayed, health, damage, attackSpeed) => {
  try {
    const player = await Player.findByPk(id);

    if (!player) {
      throw new Error("Player not found");
    }

    // Solo actualiza los atributos que están presentes en la solicitud
    const updatedData = {};

    if (gold !== undefined) updatedData.gold = gold;
    if (timePlayed !== undefined) updatedData.timePlayed = timePlayed;
    if (health !== undefined) updatedData.health = health;
    if (damage !== undefined) updatedData.damage = damage;
    if (attackSpeed !== undefined) updatedData.attackSpeed = attackSpeed;

    // Actualizar solo los atributos presentes
    await player.update(updatedData);

    return player; // Devuelve el jugador actualizado
  } catch (error) {
    throw new Error(error.message);
  }
};
