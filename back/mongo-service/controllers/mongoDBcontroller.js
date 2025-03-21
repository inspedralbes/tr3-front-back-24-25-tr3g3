import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'enemies';

const fakeEnemies = [
  { id: 1, name: "wolf", type: "enemy", level: "level1", stats: { health: 100, damage: 15 } },
  { id: 2, name: "ghostHorse", type: "enemy", level: "level1", stats: { health: 100, damage: 15 } },
  { id: 3, name: "ghost", type: "enemy", level: "level1", stats: { health: 100, damage: 15 } },
  { id: 4, name: "shooter", type: "enemy", level: "level1", stats: { health: 100, damage: 15 } },
  { id: 5, name: "demon", type: "boss", level: "level1", stats: { health: 100, damage: 15 } }
];

const fakeDifficulties = [
  {
    id: 1,
    difficulty: "facil",
    enemies: [
      { name: "wolf", quantity: 3 },
      { name: "ghostHorse", quantity: 2 },
      { name: "ghost", quantity: 2 },
      { name: "shooter", quantity: 1 }
    ]
  },
  {
    id: 2,
    difficulty: "medio",
    enemies: [
      { name: "wolf", quantity: 5 },
      { name: "ghostHorse", quantity: 4 },
      { name: "ghost", quantity: 4 },
      { name: "shooter", quantity: 3 }
    ]
  },
  {
    id: 3,
    difficulty: "dificil",
    enemies: [
      { name: "wolf", quantity: 8 },
      { name: "ghostHorse", quantity: 7 },
      { name: "ghost", quantity: 7 },
      { name: "shooter", quantity: 6 }
    ]
  }
];

class MongoDBController {
  static client;
  static db;

  static async connect() {
    try {
      this.client = new MongoClient(MONGO_URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        tls: true,
      });

      await this.client.connect();
      this.db = this.client.db(DB_NAME);
      console.log('✅ Conexión a MongoDB establecida');
      await this.initializeData();
    } catch (error) {
      console.error('❌ Error al conectar con MongoDB:', error);
      throw error;
    }
  }

  static async initializeData() {
    const enemiesCollection = this.db.collection('enemies');
    const difficultiesCollection = this.db.collection('difficulties');

    if (await enemiesCollection.countDocuments() === 0) {
      await enemiesCollection.insertMany(fakeEnemies);
      console.log('🎲 Enemigos base creados');
    }

    if (await difficultiesCollection.countDocuments() === 0) {
      await difficultiesCollection.insertMany(fakeDifficulties);
      console.log('📊 Dificultades configuradas');
    }
  }

  // Métodos CRUD para enemigos

  static async getEnemysforUnity() {
    try {
      // Consulta todos los documentos de la colección "enemies"
      const enemies = await this.db.collection('enemies').find().toArray();
  
      // Define el mapeo para renombrar keys según se requiera
      const mapping = {
        wolf: 'wolf',
        ghostHorse: 'horse',
        ghost: 'ghost',
        grunt: 'grunt',
        ogre: 'ogre'
      };
  
      // Se arma el objeto final con los stats mapeados
      const enemysForUnity = {};
  
      enemies.forEach(enemy => {
        // Solo incluimos aquellos que son de tipo "enemy" y tienen un mapeo definido
        if (enemy.type === 'enemy' && mapping[enemy.name]) {
          enemysForUnity[mapping[enemy.name]] = enemy.stats;
        }
      });
  
      return enemysForUnity;
    } catch (error) {
      console.error('Error al obtener los enemigos para Unity:', error);
      throw error;
    }
  }
  
  static async createEnemy(enemyData) {
    const lastEnemy = await this.db.collection('enemies').findOne({}, { sort: { id: -1 } });
    enemyData.id = lastEnemy ? lastEnemy.id + 1 : 1;
    return await this.db.collection('enemies').insertOne(enemyData);
  }

  static async getEnemy(id) {
    return await this.db.collection('enemies').findOne({ id: parseInt(id) });
  }

  static async getAllEnemies() {
    return await this.db.collection('enemies').find().toArray();
  }

  static async updateEnemy(id, updateData) {
    return await this.db.collection('enemies').updateOne(
      { id: parseInt(id) }, 
      { $set: updateData }
    );
  }

  static async deleteEnemy(id) {
    return await this.db.collection('enemies').deleteOne({ id: parseInt(id) });
  }

  // Métodos para dificultades (solo lectura excepto cantidades)
  static async getDifficulty(id) {
    return await this.db.collection('difficulties').findOne({ id: parseInt(id) });
  }

  static async getAllDifficulties() {
    return await this.db.collection('difficulties')
                        .find()
                        .sort({ id: 1 })
                        .toArray();
  }

  static async updateDifficultyQuantities(id, enemiesUpdate) {
    const updates = {};
    const arrayFilters = [];
    
    enemiesUpdate.forEach((enemy, index) => {
      updates[`enemies.$[elem${index}].quantity`] = enemy.quantity;
      arrayFilters.push({
        [`elem${index}.name`]: enemy.name
      });
    });

    return this.db.collection('difficulties').updateOne(
      { id: parseInt(id) },
      { $set: updates },
      { arrayFilters }
    );
  }

  static async getAllDifficulties() {
    return await this.db.collection('difficulties')
                        .find()
                        .sort({ id: 1 })
                        .toArray();
 }    

  static async close() {
    if (this.client) {
      await this.client.close();
      console.log('🔌 Conexión a MongoDB cerrada');
    }
  }
}

export default MongoDBController;