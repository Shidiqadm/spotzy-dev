// models/vehicleType.js
const { DataTypes } = require('sequelize');
const sequelize = require('../seq');

const VehicleType = sequelize.define('VehicleType', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'vehicle_types',
  timestamps: true,
});

module.exports = VehicleType;