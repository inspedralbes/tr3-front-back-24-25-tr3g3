class MongoDBController {
  static db;

  static setDb(db) {
    this.db = db;
  }

    // Método simplificado para obtener el enemigo tipo 'boss'
    static async getBOSS() {
      try {
        // Buscamos un enemigo cuyo tipo sea 'boss'
        const bossEnemy = await this.db.collection('enemies').findOne({ type: 'boss' });
  
        // Si no se encuentra el boss, devuelve null
        if (!bossEnemy) {
          console.log('No se encontró enemigo de tipo boss');
          return null;  // O puedes devolver un mensaje de error si prefieres
        }
  
        // Simplemente devolvemos los datos tal cual están
        return bossEnemy;
      } catch (error) {
        console.error('Error al obtener el enemigo tipo boss:', error);
        throw error;
      }
    }
  
  static async getEnemysforUnity() {
    try {
      const enemies = await this.db.collection('enemies').find().toArray();

      const mapping = {
        wolf: 'wolf',
        ghostHorse: 'horse',
        ghost: 'ghost',
        grunt: 'grunt',
        ogre: 'ogre'
      };

      const enemysForUnity = {};

      enemies.forEach(enemy => {
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
    console.log('Database:', this.db.databaseName);
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
}

export default MongoDBController;
