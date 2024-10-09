import React, { useState } from 'react';
import { Button, TextField, Box, CircularProgress, IconButton, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast, ToastContainer } from 'react-toastify';
import { updateProduct } from '../services/api'; // Assuming you have an API function to update the product
import 'react-toastify/dist/ReactToastify.css';

const ProductEdit = ({ product, onEditSuccess, onClose, stores, categories }) => {
  const [formData, setFormData] = useState({
    productName: product['Product Name'],
    sku: product['SKU'],
    price: product['Price'],
    storeId: product['Store ID'],
    productCategory: product['Product Category'] || 'Others', // Default category to "Others"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form fields
  const validate = () => {
    const newErrors = {};
    if (!formData.productName) {
      newErrors.productName = 'Product Name is required';
    }
    if (!formData.price || isNaN(formData.price)) {
      newErrors.price = 'Valid Price is required';
    }
    if (!formData.storeId) {
      newErrors.storeId = 'Store is required';
    }
    if (!formData.productCategory) {
      newErrors.productCategory = 'Category is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    console.log("product", product);
    if (!validate()) return;

    setLoading(true);
    try {
      await updateProduct(product['Prod ID'], formData); // Update product by Prod ID
      toast.success('Product updated successfully');
      if (onEditSuccess) {
        onEditSuccess(); // Call success callback
      }
    } catch (error) {
      console.error('Error updating product', error);
      toast.error('Error updating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>
      {/* Close Icon */}
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <CloseIcon />
      </IconButton>

      {/* Modal Heading */}
      <h2>Edit Product</h2>

      {/* Product Name Field */}
      <TextField
        label="Product Name"
        name="productName"
        value={formData.productName}
        onChange={handleInputChange}
        required
        error={!!errors.productName}
        helperText={errors.productName}
        fullWidth
      />

      {/* SKU Field (Disabled) */}
      <TextField
        label="SKU"
        name="sku"
        value={formData.sku}
        onChange={handleInputChange}
        disabled
        fullWidth
      />

      {/* Price Field */}
      <TextField
        label="Price"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        required
        error={!!errors.price}
        helperText={errors.price}
        fullWidth
        type="number"
      />

      {/* Store Dropdown */}
      <FormControl fullWidth error={!!errors.storeId}>
        <InputLabel>Store</InputLabel>
        <Select
          label="Store"
          name="storeId"
          value={formData.storeId}
          onChange={handleInputChange}
          required
        >
          {stores?.map((store) => (
            <MenuItem key={store.storeId} value={store.storeId}>
              {store.storeName}
            </MenuItem>
          ))}
        </Select>
        {errors.storeId && <FormHelperText>{errors.storeId}</FormHelperText>}
      </FormControl>

      {/* Category Dropdown */}
      <FormControl fullWidth error={!!errors.productCategory}>
        <InputLabel>Category</InputLabel>
        <Select
          label="Category"
          name="productCategory"
          value={formData.productCategory}
          onChange={handleInputChange}
          required
        >
          {categories?.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
        {errors.productCategory && <FormHelperText>{errors.productCategory}</FormHelperText>}
      </FormControl>

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : 'Update Product'}
      </Button>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
    </Box>
  );
};

export default ProductEdit;
