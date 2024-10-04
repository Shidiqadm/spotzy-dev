'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      userName: {
        type: Sequelize.STRING
      },
      parkingSpot: {
        type: Sequelize.STRING
      },
      vehicleNo: {
        type: Sequelize.STRING
      },
      vehicleType: {
        type: Sequelize.STRING
      },
      checkinDate: {
        type: Sequelize.DATE
      },
      checkoutDate: {
        type: Sequelize.DATE
      },
      advanceAmount: {
        type: Sequelize.FLOAT
      },
      calculatedAmount: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vehicles');
  }
};