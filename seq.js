const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  username: 'sparten_ahmed',
  password: null,
  database: 'spotzy',
  host: '127.0.0.1',
  port: 5432,
});

module.exports = sequelize;

// 3. Define your Sequelize models


// 4. Synchronize the models with the database
const databaseSchema = process.env.DATABASE_SCHEMA || 'public';
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Synchronize the models with the database (create tables if they don't exist)
    await sequelize.sync({ force: false, schema: 'public' }); // Set force to true to drop existing tables and recreate them

    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();