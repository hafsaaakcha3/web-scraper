import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Categories from './component/Categories';
import Products from './component/Products';
import ProductInfo from './component/ProductInfo';



const App: React.FC = () => {
  let [location, setLocation] = useState(String)

  console.log(location)

  return (
    <Router>
      <div style={{ marginLeft: '20%', marginRight: "20%" }}>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <h2
              className={`nav-link ${location === '/' ? 'active' : ''}`}
              onClick={() => setLocation('/')} >
              <Link to='/'>Categories</Link>
            </h2>
          </li>
          <li className="nav-item ">
            <h2
              className={`nav-link ${location === '/products' ? 'active' : ''}`}
              onClick={() => setLocation('/products')}
            >
              <Link to='/products'>Products</Link>
            </h2>
          </li>
          <li className="nav-item">
            <h2
              className={`nav-link ${location === '/productInfo' ? 'active' : ''}`}
              onClick={() => setLocation('/productInfo')} >
              <Link to='/productInfo'>Product Info</Link>
            </h2>
          </li>
        </ul>


        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/productInfo" element={<ProductInfo />} />
        </Routes>
      </div>
    </Router >
  );
};

export default App;
