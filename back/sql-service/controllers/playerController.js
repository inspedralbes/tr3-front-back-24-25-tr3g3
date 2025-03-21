import { Player } from "../models/index.js";
import { getUserByEmail } from "./userController.js"; 

export const createPlayer = async (req, res) => {
  try {
    const { email, gold, timePlayed, health, damage, attackSpeed } = req.body;

    // Verificar si el email pertenece a un usuario
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found for the given email" });
    }

    const newPlayer = await Player.create({
      email,
      gold,
      timePlayed,
      health,
      damage,
      attackSpeed,
    });

    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPlayers = async () => {
  try {
    const players = await Player.findAll();
    return players; // Ahora solo retorna los datos
  } catch (error) {
    throw new Error(error.message); // Lanza el error para que el controlador lo maneje
  }
};


export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPlayerByEmail = async (req, res) => {
  try {
    const player = await Player.findOne({ where: { email: req.params.email } });
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualiza atributos específicos de un jugador de manera independiente
export const updatePlayer = async (req, res) => {
  try {
    const { gold, timePlayed, health, damage, attackSpeed } = req.body;
    const player = await Player.findByPk(req.params.id);

    if (!player) return res.status(404).json({ message: "Player not found" });

    // Solo actualiza las propiedades que estén presentes en el cuerpo de la solicitud
    const updatedData = {};

    if (gold !== undefined) updatedData.gold = gold;
    if (timePlayed !== undefined) updatedData.timePlayed = timePlayed;
    if (health !== undefined) updatedData.health = health;
    if (damage !== undefined) updatedData.damage = damage;
    if (attackSpeed !== undefined) updatedData.attackSpeed = attackSpeed;

    // Actualizar sólo los atributos que fueron proporcionados
    await player.update(updatedData);

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ruta para actualizar las estadísticas de un jugador por separado
export const updatePlayerStats = async (req, res) => {
  try {
    const { gold, timePlayed, health, damage, attackSpeed } = req.body;
    const player = await Player.findByPk(req.params.id);

    if (!player) return res.status(404).json({ message: "Player not found" });

    // Verifica y actualiza sólo los atributos que están presentes en el cuerpo de la solicitud
    const updatedStats = {};

    if (gold !== undefined) updatedStats.gold = gold;
    if (timePlayed !== undefined) updatedStats.timePlayed = timePlayed;
    if (health !== undefined) updatedStats.health = health;
    if (damage !== undefined) updatedStats.damage = damage;
    if (attackSpeed !== undefined) updatedStats.attackSpeed = attackSpeed;

    // Actualiza las estadísticas solo con los datos proporcionados
    await player.update(updatedStats);

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });

    await player.destroy();
    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
