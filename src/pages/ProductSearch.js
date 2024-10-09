import React, { useState } from 'react';
import { searchProducts } from '../services/api';

const ProductSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await searchProducts(query);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching products', error);
      alert('Error searching products');
    }
  };

  return (
    <div>
      <h2>Search Products</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by Product Name"
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {results.map((product) => (
          <li key={product.product_id}>
            {product.product_name} - {product.price}$
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSearch;
