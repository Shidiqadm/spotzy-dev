// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Vehicle extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Vehicle.init({
//     userId: DataTypes.INTEGER,
//     userName: DataTypes.STRING,
//     parkingSpot: DataTypes.STRING,
//     vehicleNo: DataTypes.STRING,
//     vehicleType: DataTypes.STRING,
//     checkinDate: DataTypes.DATE,
//     checkoutDate: DataTypes.DATE,
//     advanceAmount: DataTypes.FLOAT,
//     calculatedAmount: DataTypes.FLOAT
//   }, {
//     sequelize,
//     modelName: 'Vehicle',
//   });
//   return Vehicle;
// };

// models/Vehicle.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Vehicle extends Model {
    static associate(models) {
      // Define associations here
      this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Vehicle.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID, // Should match User's id type
      allowNull: false,
      references: {
        model: 'Users', // Name of the User model
        key: 'id',
      },
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parkingSpot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checkinDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkoutDate: {
      type: DataTypes.DATE,
      allowNull: true, // Checkout date can be null until the vehicle checks out
    },
    advanceAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    calculatedAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  }, {
    sequelize, // Sequelize instance
    modelName: 'Vehicle', // Model name
  });

  return Vehicle;
};