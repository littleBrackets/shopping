import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import AddCategory from "./pages/AddCategory";
import CategoryList from "./pages/CategoryList";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/category-list" element={<CategoryList />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
