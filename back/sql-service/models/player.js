import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Player = sequelize.define("Player", {
    gold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    timePlayed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    health: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    damage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    attackSpeed: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1.0,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  }, {
    tableName: "players",
    timestamps: false,
  });

  return Player;
};
