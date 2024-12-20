const { DataTypes } = require('sequelize');
const sequelize = require('../seq');

const ParkingSpot = sequelize.define('ParkingSpot', {
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
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'available',
  },
}, {
  tableName: 'parking_spots',
  timestamps: true,
});

module.exports = ParkingSpot;