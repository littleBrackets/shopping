const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Sequelize instance

// Define the Category model
const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  }
});

module.exports = Category;
