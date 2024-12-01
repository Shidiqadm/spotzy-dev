// models/checkIn.js
const { DataTypes } = require('sequelize');
const sequelize = require('../seq');
const Vehicle = require('./vehicle');
const ParkingSpot = require('./parkingSpot');
const Tariff = require('./Tariff');

const CheckIn = sequelize.define('CheckIn', {
  vehicleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Vehicle, key: 'id' },
    onDelete: 'CASCADE',
  },
  parkingSpotId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: ParkingSpot, key: 'id' },
    onDelete: 'CASCADE',
  },
  checkinTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  checkoutTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  parkingMethod: {
    type: DataTypes.ENUM('daily', 'monthly'),
    allowNull: false,
  },
  tariffId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Tariff, key: 'id' },
  },
  advanceAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  calculatedAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed'),
    allowNull: false,
    defaultValue: 'active',
  }
}, {
  tableName: 'checkins',
  timestamps: true,
});

module.exports = CheckIn;