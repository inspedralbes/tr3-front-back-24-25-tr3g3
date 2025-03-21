import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoRouter from './routes/mongo-routes.js'; 
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/', mongoRouter); 

app.listen(port, () => {
  console.log(`🚀 Mongo service listo en http://localhost:${port}`);
});
