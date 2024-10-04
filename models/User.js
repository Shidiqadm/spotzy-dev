// const { Model, DataTypes } = require('sequelize');
// const bcrypt = require('bcrypt');

// class User extends Model {
//   // Custom method to validate password
//   async isValidPassword(password) {
//     return await bcrypt.compare(password, this.password);
//   }

//   static associate(models) {
//     // Define associations here if necessary
//     // Example: this.hasMany(models.Vehicle, { foreignKey: 'userId' });
//   }
// }

// User.init({
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: {
//       isEmail: true, // Email validation
//     },
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// }, {
//   sequelize, // Sequelize instance
//   modelName: 'User', // Model name
//   hooks: {
//     // Automatically hash password before saving
//     beforeCreate: async (user) => {
//       if (user.password) {
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(user.password, salt);
//       }
//     },
//   },
// });

// module.exports = User;

// models/User.js
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model {
    // Custom method to validate password
    async isValidPassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    static associate(models) {
      // Define associations here
      this.hasMany(models.Vehicle, { foreignKey: 'userId' });
    }
  }

  User.init({
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Email validation
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize, // Sequelize instance
    modelName: 'User', // Model name
    hooks: {
      // Automatically hash password before saving
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  return User;
};