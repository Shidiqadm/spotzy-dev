// models/ParkingSpot.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ParkingSpot extends Model {
    static associate(models) {
      // Define associations if necessary
    }
  }

  ParkingSpot.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    spotNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    hourlyRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ParkingSpot',
  });

  return ParkingSpot;
};