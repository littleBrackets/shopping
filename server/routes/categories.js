const express = require('express');
const Category = require('../models/Category');  // Assuming Sequelize is used

const router = express.Router();

// GET request to fetch all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();  // Fetch all categories from the database
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});


// Bulk add categories
router.post('/bulk', async (req, res) => {
  const { categories } = req.body;

  try {
    // Validate categories array
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'Invalid category data' });
    }

    // Bulk create categories
    const addedCategories = await Category.bulkCreate(categories);
    res.status(201).json(addedCategories);
  } catch (error) {
    console.error('Error adding categories:', error);
    res.status(500).json({ message: 'Server error while adding categories' });
  }
});

// Existing single category add route
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error while adding category' });
  }
});



module.exports = router;
