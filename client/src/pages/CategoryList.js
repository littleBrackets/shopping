import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Category List</h1>
      {categories.length === 0 ? (
        <p>No categories available.</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryList;
