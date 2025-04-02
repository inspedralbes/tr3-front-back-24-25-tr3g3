import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';
import MongoDBController from './controllers/mongoDBcontroller.js';
import StatsController from './controllers/statsController.js';
import mongoRouter from './routes/mongo-routes.js';
import statsRouter from './routes/stats-routes.js';

const app = express();
const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use('/', mongoRouter);
app.use('/', statsRouter); // Agregamos las rutas de estadísticas

// Conexión a MongoDB
async function connectToMongo() {
  try {
    const client = new MongoClient(MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      tls: true,
    });

    await client.connect();
    const dbEnemies = client.db('enemies'); // Base de datos de enemigos
    const dbStats = client.db('stats'); // Base de datos de estadísticas

    MongoDBController.setDb(dbEnemies);
    StatsController.setDb(dbStats);

    console.log('✅ Conexión a MongoDB establecida');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
  }
}

connectToMongo().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Servicio listo en http://localhost:${port}`);
  });
});
