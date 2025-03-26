import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';
import MongoDBController from './controllers/mongoDBcontroller.js';
import mongoRouter from './routes/mongo-routes.js';

const app = express();
const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI; // Asegúrate de que la URI de MongoDB esté en tu archivo .env

app.use(cors());
app.use(express.json());
app.use('/', mongoRouter);

// Establecer la conexión con MongoDB antes de iniciar el servidor Express
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
    const db = client.db('enemies'); // Usa la base de datos predeterminada o la que prefieras
    MongoDBController.setDb(db); // Pasa la conexión a MongoDBController

    console.log('✅ Conexión a MongoDB establecida');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
  }
}

connectToMongo().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Mongo service listo en http://localhost:${port}`);
  });
});
         