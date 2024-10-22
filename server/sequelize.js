const { Sequelize } = require('sequelize');

// Initialize SQLite connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // Path to SQLite database file
});

module.exports = sequelize;
