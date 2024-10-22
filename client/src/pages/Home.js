import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to the Shopping App</h1>
      <Link to="/product-list">
        <button>View Products</button>
      </Link>
      <Link to="/add-product">
        <button>Add Product</button>
      </Link>
      <Link to="/add-category">
        <button>Add Category</button>
      </Link>
    </div>
  );
}

export default Home;
