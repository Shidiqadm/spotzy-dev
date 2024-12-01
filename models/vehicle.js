// models/vehicle.js
const { DataTypes } = require('sequelize');
const sequelize = require('../seq');
const Customer = require('./Customer'); // Make sure to import the Customer model
const VehicleType = require('./VehicleType'); // Import the VehicleType model

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  vehicleNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vehicleTypeId: { // Use vehicleTypeId to reference VehicleType
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: VehicleType,
      key: 'id',
    },
  },
  customerId: { // Reference the Customer
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id',
    },
  },
}, {
  tableName: 'vehicles',
  timestamps: true,
});

module.exports = Vehicle;
