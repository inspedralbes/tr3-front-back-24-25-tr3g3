import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true // Cambiamos email a clave primaria
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('cliente', 'admin'),
      allowNull: false,
      defaultValue: 'cliente',
    }
  }, {
    tableName: 'users',
    timestamps: false,
  });

  return User;
};
