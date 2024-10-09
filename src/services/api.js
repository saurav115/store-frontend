import axios from 'axios';

// Set base URL for all API requests
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Export your API instance for use in components
export const uploadPricingFeed = (formData) => API.post('/products/upload', formData);
export const searchProducts = (query, storeId, category, minPrice = 0, maxPrice = Infinity, page = 1, limit = 10) => {
  const params = new URLSearchParams({
    query: query || '',
    storeId: storeId || '',
    category: category || '',
    minPrice: minPrice.toString(),
    maxPrice: maxPrice.toString(),
    page: page,
    limit: limit
  });

  return API.get(`/products/search?${params.toString()}`);
};
export const updateProduct = (prodId, data) => API.put(`/products/edit/${prodId}`, data);
export const getAllStores = () => API.get('/store');
export const getAllCategories = () => API.get('/products/categories');
export const recordSale = (saleData) => API.post('/sales/record', saleData);
export const getInventoryReport = () => API.get('/dashboard/inventory');

// Updated getSalesReport to handle optional date range parameters
export const getSalesReport = ({ startDate, endDate } = {}) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  return API.get(`/dashboard/sales?${params.toString()}`);
};

export const getWeeklySalesReport = () => API.get('/dashboard/weekly-sales');

export default API;
