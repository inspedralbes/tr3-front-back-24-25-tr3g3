import { ObjectId } from 'mongodb';

class StatsController {
  static db;

  static setDb(db) {
    this.db = db;
  }

  // Obtener todas las estadísticas
  static async getAllStats() {
    try {
      return await this.db.collection('stats').find().toArray();
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // Obtener una estadística por ID
  static async getStatById(id) {
    try {
      return await this.db.collection('stats').findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error('Error al obtener estadística:', error);
      throw error;
    }
  }

  // Crear una nueva estadística
  static async createStat(statData) {
    try {
      // Validar el modelo JSON
      const { email, fecha, estadisticas } = statData;
      if (
        !email ||
        !fecha ||
        !estadisticas ||
        typeof estadisticas.ghost_killed !== 'number' ||
        typeof estadisticas.grunt_killed !== 'number' ||
        typeof estadisticas.horse_killed !== 'number' ||
        typeof estadisticas.ogre_killed !== 'number' ||
        typeof estadisticas.wolf_killed !== 'number' ||
        typeof estadisticas.boss_killed !== 'number'
      ) {
        throw new Error('Datos inválidos para crear la estadística.');
      }

      statData.fecha = new Date(fecha); // Convertir la fecha a formato Date
      return await this.db.collection('stats').insertOne(statData);
    } catch (error) {
      console.error('Error al crear estadística:', error);
      throw error;
    }
  }

  // Actualizar una estadística
  static async updateStat(id, updateData) {
    try {
      if (updateData.fecha) {
        updateData.fecha = new Date(updateData.fecha); // Convertir la fecha a formato Date si se incluye
      }

      return await this.db.collection('stats').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
    } catch (error) {
      console.error('Error al actualizar estadística:', error);
      throw error;
    }
  }

  // Eliminar una estadística
  static async deleteStat(id) {
    try {
      return await this.db.collection('stats').deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error('Error al eliminar estadística:', error);
      throw error;
    }
  }

  // Obtener estadísticas por email
  static async getStatsByEmail(email) {
    try {
      return await this.db.collection('stats')
        .find({ email })
        .sort({ fecha: 1 }) // Ordenar por fecha ascendente
        .toArray();
    } catch (error) {
      console.error('Error al obtener estadísticas por email:', error);
      throw error;
    }
  }

  // Obtener estadísticas por fecha
  static async getStatsByDate(fecha) {
    try {
      const parsedFecha = new Date(fecha); // Convertir la fecha a formato Date
      return await this.db.collection('stats')
        .find({ fecha: parsedFecha })
        .sort({ email: 1 }) // Ordenar por email ascendente
        .toArray();
    } catch (error) {
      console.error('Error al obtener estadísticas por fecha:', error);
      throw error;
    }
  }
}

export default StatsController;
