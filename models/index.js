const Sequelize = require('sequelize');
const sequelize = require('../seq'); // Ensure this points to your sequelize instance

// Import models
const User = require('./user');
const Vehicle = require('./vehicle');
const ParkingSpot = require('./parkingSpot');
const CheckIn = require('./CheckIn');
const Customer = require('./Customer');
const Tariff = require('./Tariff');
const VehicleType = require('./VehicleType'); // Import VehicleType

// Initialize models
const models = {
  User: User,
  Vehicle: Vehicle,
  ParkingSpot: ParkingSpot,
  CheckIn: CheckIn,
  Customer: Customer,
  Tariff: Tariff,
  VehicleType: VehicleType, // Add VehicleType to models
};

// Define associations

// User and Vehicle associations
models.User.hasMany(models.Vehicle, { foreignKey: 'userId', as: 'userVehicles' });  // Updated alias to be more specific
models.Vehicle.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' }); // Alias remains 'owner'

// Vehicle and CheckIn associations
models.Vehicle.hasMany(models.CheckIn, { foreignKey: 'vehicleId', as: 'vehicleCheckIns' });  // Updated alias
models.CheckIn.belongsTo(models.Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });  // Alias remains 'vehicle'

// CheckIn and ParkingSpot associations
models.CheckIn.belongsTo(models.ParkingSpot, { foreignKey: 'parkingSpotId', as: 'parkingSpot' }); // Alias remains 'parkingSpot'
models.ParkingSpot.hasMany(models.CheckIn, { foreignKey: 'parkingSpotId', as: 'spotCheckIns' });  // Updated alias

// Customer and Vehicle associations
models.Customer.hasMany(models.Vehicle, { foreignKey: 'customerId', as: 'customerVehicles' }); // Updated alias
models.Vehicle.belongsTo(models.Customer, { foreignKey: 'customerId', as: 'customer' }); // Alias remains 'customer'

// Customer and CheckIn associations
models.Customer.hasMany(models.CheckIn, { foreignKey: 'customerId', as: 'customerCheckIns' }); // Updated alias
models.CheckIn.belongsTo(models.Customer, { foreignKey: 'customerId', as: 'customer' }); // Alias remains 'customer'

// VehicleType and Tariff associations
models.VehicleType.hasMany(models.Tariff, { foreignKey: 'vehicleTypeId', as: 'vehicleTariffs' }); // Updated alias
models.Tariff.belongsTo(models.VehicleType, { foreignKey: 'vehicleTypeId', as: 'vehicleType' }); // Alias remains 'vehicleType'

// Tariff and CheckIn associations
models.Tariff.hasMany(models.CheckIn, { foreignKey: 'tariffId', as: 'tariffCheckIns' }); // Updated alias
models.CheckIn.belongsTo(models.Tariff, { foreignKey: 'tariffId', as: 'tariff' }); // Alias remains 'tariff'

// Add this if it's not already present
models.Vehicle.belongsTo(models.VehicleType, { foreignKey: 'vehicleTypeId', as: 'vehicleType' });

// Export models
module.exports = {
  ...models,
  sequelize,
  Sequelize,
};