import dotenv from 'dotenv';

dotenv.config();

const SQL_SERVICE_URL = process.env.SQL_SERVICE_URL;

export class UserRepository {
  static async findByEmail(email) {
    const response = await fetch(`${SQL_SERVICE_URL}/user/email/${email}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la solicitud');
    }
    return response.json();
  }

  static async createUser(userData) {
    const response = await fetch(`${SQL_SERVICE_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }

  async changePassword(userId, password) {
    try {
      const response = await fetch(`${SQL_SERVICE_URL}/user/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          password: password 
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar la contraseña');
      }
  
      return true;
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      throw error;
    }
  }


}