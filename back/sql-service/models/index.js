import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

dotenv.config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;

// Función para esperar a que la base de datos esté lista
async function waitForDatabase() {
  let connected = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!connected && attempts < maxAttempts) {
    try {
      const connection = await mysql.createConnection({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
      });
      console.log("✅ Conexión con el servicio MySQL exitosa.");
      await connection.end();
      connected = true;
    } catch (error) {
      attempts++;
      console.error(`⏳ Esperando la base de datos... Intento ${attempts}/${maxAttempts}`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  if (!connected) {
    console.error("❌ No se pudo conectar a la base de datos después de varios intentos.");
    process.exit(1);
  }
}

async function createDatabaseIfNotExists() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    const [rows] = await connection.query(`SHOW DATABASES LIKE '${DB_DATABASE}'`);
    if (rows.length === 0) {
      console.log(`📦 Creando la base de datos "${DB_DATABASE}"...`);
      await connection.query(`CREATE DATABASE \`${DB_DATABASE}\`;`);
      console.log(`✅ Base de datos "${DB_DATABASE}" creada.`);
    }
    await connection.end();
  } catch (error) {
    console.error("❌ Error al verificar o crear la base de datos:", error);
    process.exit(1);
  }
}

async function seedData(User, Player) {
  const userCount = await User.count();
  
  if (userCount === 0) {
    console.log("🌱 Insertando usuarios de prueba...");
    
    const users = await User.bulkCreate([
      {
        email: "usuario1@example.com",
        username: "UsuarioUno",
        password: await bcrypt.hash("password123", 10),
        rol: "cliente",
      },
      {
        email: "admin@example.com",
        username: "AdminUser",
        password: await bcrypt.hash("adminpass", 10),
        rol: "admin",
      },
    ]);

    console.log("✅ Usuarios de prueba insertados.");

    console.log("🌱 Insertando jugadores asociados...");
    await Player.bulkCreate([
      {
        email: users[0].email,
        gold: 100,
        timePlayed: 3600,
        health: 100,
        damage: 15,
        attackSpeed: 1.2,
      },
      {
        email: users[1].email,
        gold: 500,
        timePlayed: 7200,
        health: 150,
        damage: 20,
        attackSpeed: 1.5,
      },
    ]);
    console.log("✅ Jugadores de prueba insertados.");
  }
}

async function initializeSequelize() {
  await waitForDatabase();
  await createDatabaseIfNotExists();

  const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "mysql",
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log("🚀 Conectado a la base de datos.");

    // Importar modelos
    const User = (await import("./user.js")).default(sequelize);
    const Player = (await import("./player.js")).default(sequelize);

    // Establecer relaciones
    User.hasOne(Player, {
      foreignKey: "email",
      sourceKey: "email",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });

    Player.belongsTo(User, {
      foreignKey: "email",
      targetKey: "email",
    });

    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log("🔄 Modelos sincronizados.");

    // Insertar datos
    await seedData(User, Player);

    return { sequelize, User, Player };
  } catch (error) {
    console.error("❌ Error al inicializar:", error);
    process.exit(1);
  }
}

const { sequelize, User, Player } = await initializeSequelize();

export { sequelize, User, Player };
export default sequelize;
