import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [isBulk, setIsBulk] = useState(false);  // State to toggle between bulk and individual modes
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [productJson, setProductJson] = useState('');  // Store the JSON input for bulk mode
  const [categoryId, setCategoryId] = useState('');  // Store the selected category

  const navigate = useNavigate();

  // Fetch categories from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories', error);
      });
  }, []);

  // Handle individual product field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if category is selected
    if (!categoryId) {
      alert("Please select a category.");
      return;
    }

    if (isBulk) {
      // Bulk mode: Validate and send JSON data
      let products;
      try {
        products = JSON.parse(productJson);
      } catch (error) {
        alert('Invalid JSON format');
        return;
      }

      if (!Array.isArray(products)) {
        alert('JSON must represent an array of products');
        return;
      }

      // Send POST request for bulk addition
      axios.post(`http://localhost:5000/api/products/raw-bulk-insert`, products)
        .then(() => {
          alert('Products added successfully!');
          navigate('/product-list');  // Redirect after success
        })
        .catch((error) => {
          console.error('Error adding products', error);
          alert('Failed to add products');
        });
    } else {
      // Individual mode: Send single product data
      const { name, price, description } = productData;

      axios.post(`http://localhost:5000/api/products/${categoryId}`, {
        name,
        price,
        description
      })
        .then(() => {
          alert('Product added successfully!');
          navigate('/product-list');
        })
        .catch((error) => {
          console.error('Error adding product', error);
          alert('Failed to add product');
        });
    }
  };

  return (
    <div>
      <h1>Add Product</h1>

      {/* Toggle between individual and bulk modes */}
      <div>
        <label>
          <input
            type="radio"
            name="mode"
            checked={!isBulk}
            onChange={() => setIsBulk(false)}
          />
          Add Individual Product
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            checked={isBulk}
            onChange={() => setIsBulk(true)}
          />
          Add Multiple Products (Bulk)
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Category:</label>
          <select
            name="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">--Select a category--</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {isBulk ? (
          // Bulk mode: Show textarea for JSON input
          <div>
            <label>Paste Products JSON:</label>
            <textarea
              name="productJson"
              rows="10"
              value={productJson}
              onChange={(e) => setProductJson(e.target.value)}
              placeholder='[{"name": "Product 1", "price": 10.99, "description": "Description 1"}, {"name": "Product 2", "price": 12.99, "description": "Description 2"}]'
              required
            />
          </div>
        ) : (
          // Individual mode: Show input fields for product details
          <>
            <div>
              <label>Product Name:</label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label>Description:</label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        <button type="submit">
          {isBulk ? 'Add Products (Bulk)' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
