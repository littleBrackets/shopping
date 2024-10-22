const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');  // Import the Category model
const Sequelize = require("../sequelize");

const router = express.Router();

router.get('/schema', async (req, res) => {
  try {
    // Execute the PRAGMA statement to get the table structure
    const [results] = await Sequelize.query("PRAGMA table_info(Products);");

    // Send the results back to the client
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching table info: ", error);
    res.status(500).json({
      message: "An error occurred while fetching table schema",
      error: error.message
    });
  }
});


router.post('/raw-bulk-insert', async (req, res) => {
  try {
    const products = req.body; // Expecting an array of products
    
    // Constructing the bulk insert SQL query
    const values = products.map(product => {
      return `('${product.name}', ${product.price}, '${product.description}', ${product.categoryId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
    }).join(', ');  // Join all product values with commas
    
    const query = `
      INSERT INTO Products (name, price, description, categoryId, createdAt, updatedAt) 
      VALUES ${values};
    `;
    
    // Execute the raw SQL query
    const [results, metadata] = await Sequelize.query(query);

    res.status(201).json({
      message: "Products added successfully via bulk insert",
      results
    });
  } catch (error) {
    console.error("Error executing bulk insert: ", error);
    res.status(500).json({
      message: "An error occurred during bulk insert",
      error: error.message
    });
  }
});


// GET all products (existing route)
router.get('/', async (req, res) => {
  try {
    const [results] = await Sequelize.query("select * from products");
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a single product by ID (existing route)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: Category
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST route to add a product by category ID
router.post('/:categoryId', async (req, res) => {
  const { name, price, description } = req.body;
  const { categoryId } = req.params;

  try {
    // Check if the category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Create the product and associate it with the category
    const product = await Product.create({
      name,
      price,
      description,
      categoryId  // Associate product with the provided category ID
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// POST route to add multiple products based on category ID
router.post('/:categoryId/bulk', async (req, res) => {
  const { categoryId } = req.params;
  const products = req.body;

  try {
    // Check if the category exists
    console.log('test 1');
    
    const category = await Category.findByPk(categoryId);
    if (!category) {
      console.log('test 2');
      return res.status(404).json({ message: 'Category not found' });
    }
    console.log('test 3');

    // Ensure the input is an array of products
    if (!Array.isArray(products)) {
      console.log('test 4');
      return res.status(400).json({ message: 'Expected an array of products' });
    }

    console.log('test 5');
    // Create all products associated with the category
    const createdProducts = await Promise.all(products.map(product => {
      return Product.create({
        name: product.name,
        price: product.price,
        description: product.description,
        categoryId: product.categoryId  // Associate product with the category ID
      });
    }));
    console.log('test 6');
    res.status(201).json({ message: 'Products created successfully', products: createdProducts });
  } catch (err) {
    console.log('test 7');
    res.status(500).json({ message: 'Server error', error: err });
  }
});



module.exports = router;
