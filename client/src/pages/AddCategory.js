import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCategory() {
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: ''
  });
  const [bulkCategoryData, setBulkCategoryData] = useState('');  // JSON input for bulk addition
  const [isBulk, setIsBulk] = useState(false);  // Switch between single and bulk add
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle single category input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  // Handle bulk category input change (JSON)
  const handleBulkInputChange = (e) => {
    setBulkCategoryData(e.target.value);
  };

  // Toggle between single and bulk add
  const toggleBulkAdd = () => {
    setIsBulk(!isBulk);
    setMessage('');  // Clear any previous message
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isBulk) {
      // Handle bulk add: Parse the JSON and send to backend
      try {
        const categories = JSON.parse(bulkCategoryData);
        axios.post('http://localhost:5000/api/categories/bulk', { categories })
          .then((response) => {
            setMessage('Categories added successfully!');
            navigate('/category-list');
          })
          .catch((error) => {
            console.error('Error adding categories:', error);
            setMessage('Failed to add categories');
          });
      } catch (error) {
        console.error('Invalid JSON:', error);
        setMessage('Invalid JSON format');
      }
    } else {
      // Handle single category add
      axios.post('http://localhost:5000/api/categories', categoryData)
        .then((response) => {
          setMessage('Category added successfully!');
          navigate('/category-list');
        })
        .catch((error) => {
          console.error('Error adding category:', error);
          setMessage('Failed to add category');
        });
    }
  };

  return (
    <div>
      <h1>{isBulk ? 'Bulk Add Categories' : 'Add New Category'}</h1>

      <button onClick={toggleBulkAdd}>
        {isBulk ? 'Switch to Single Add' : 'Switch to Bulk Add'}
      </button>

      <form onSubmit={handleSubmit}>
        {isBulk ? (
          // Bulk Add: JSON input for multiple categories
          <div>
            <label>Bulk Category JSON:</label>
            <textarea
              name="bulkCategoryData"
              value={bulkCategoryData}
              onChange={handleBulkInputChange}
              placeholder={`[{"name": "Category1", "description": "Desc1"}, {"name": "Category2", "description": "Desc2"}]`}
              required
            />
          </div>
        ) : (
          // Single Add: Input fields for one category
          <>
            <div>
              <label>Category Name:</label>
              <input
                type="text"
                name="name"
                value={categoryData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label>Category Description:</label>
              <textarea
                name="description"
                value={categoryData.description}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        <button type="submit">{isBulk ? 'Add Categories' : 'Add Category'}</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddCategory;
