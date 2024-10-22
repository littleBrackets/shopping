const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Category = require('./Category');

// Define Product model
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category, // name of the target model (Category)
      key: 'id'            // key in the target model
    },
    onDelete: 'CASCADE'     // if a category is deleted, its associated products will be deleted
  }
}, {
  timestamps: true,  // This is enabled by default, but you can explicitly specify it.
  createdAt: 'createdAt',  // Can rename if needed
  updatedAt: 'updatedAt'   // Can rename if needed
});

module.exports = Product;
