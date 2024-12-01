const { DataTypes } = require('sequelize');
const sequelize = require('../seq');
const VehicleType = require('./VehicleType');

const Tariff = sequelize.define('Tariff', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  vehicleTypeId: { // Change this to vehicleTypeId
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: VehicleType, // Referencing the Vehicle model
      key: 'id', // Ensure this is the correct key in Vehicle
    },
  },
  rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  parkingMethod: {
    type: DataTypes.ENUM('monthly', 'daily'),
    allowNull: false,
  },
}, {
  tableName: 'tariffs',
  timestamps: true,
});

module.exports = Tariff;