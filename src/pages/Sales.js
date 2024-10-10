// src/components/Sales.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Autocomplete } from '@mui/material';
import { getAllStores, searchProducts, recordSale } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sales = ({ selectedProductId = '', isProductDisabled = false, onClose }) => {
    const [stores, setStores] = useState([]);
    const [products, setProducts] = useState([]);
    const [storeId, setStoreId] = useState('');
    const [productId, setProductId] = useState(selectedProductId);
    const [quantity, setQuantity] = useState(1);
    const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]); // Use current date
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Fetch stores from API
        const fetchStores = async () => {
            try {
                const storesData = await getAllStores();
                setStores(storesData?.data || []);
            } catch (error) {
                console.error('Error fetching stores:', error);
            }
        };
        fetchStores();
    }, []);

    // Fetch products based on search term and store ID
    const fetchProducts = async (searchTerm, storeId = '') => {
        try {
            const productsData = await searchProducts(searchTerm, storeId);
            setProducts(productsData?.data.results || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        // Update total price whenever quantity or product changes
        const selectedProduct = products.find((product) => product['Prod ID'] === productId);
        if (selectedProduct) {
            const price = parseFloat(selectedProduct.Price);
            setTotalPrice(price * quantity);

            // If no store is selected, set the store based on the selected product
            if (!storeId && selectedProduct['Store ID']) {
                setStoreId(selectedProduct['Store ID']);
            }
        }
    }, [productId, quantity, products]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await recordSale({
                storeId,
                productId,
                quantity,
                date: saleDate,
                totalPrice
            });
            toast.success('Sale recorded successfully!');
            if (onClose) onClose(); // Close the form if it's in a modal
        } catch (error) {
            console.error('Error recording sale:', error);
            toast.error('Failed to record sale.');
        }
    };

    const handleStoreChange = (e) => {
        const newStoreId = e.target.value;
        setStoreId(newStoreId);
        // Clear product selection when changing the store
        setProductId('');
        // Fetch products for the selected store
        fetchProducts('', newStoreId);
    };

    const handleProductChange = (event, newValue) => {
        if (newValue) {
            setProductId(newValue['Prod ID']);
        } else {
            setProductId('');
        }
    };

    const handleDateChange = (e) => {
        setSaleDate(e.target.value);
    };

    return (
      <>
        <h2 style={{marginLeft: '30px'}}>Record a Sale</h2>
        <form onSubmit={handleSubmit} style={{background: 'white', margin: '30px', padding: '30px'}}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Store</InputLabel>
                        <Select
                            value={storeId}
                            onChange={handleStoreChange}
                            label="Store"
                            required
                        >
                            <MenuItem value="">
                                <em>Select a Store</em>
                            </MenuItem>
                            {stores.map((store) => (
                                <MenuItem key={store.storeId} value={store.storeId}>
                                    {store.storeName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        options={products}
                        getOptionLabel={(option) => option['Product Name']}
                        onInputChange={(event, value) => fetchProducts(value, storeId)} // Fetch products based on input
                        value={products.find((product) => product['Prod ID'] === productId) || null}
                        onChange={handleProductChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Product"
                                variant="outlined"
                                size="small"
                                fullWidth
                                required
                            />
                        )}
                        disableClearable
                        disabled={isProductDisabled}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        fullWidth
                        size="small"
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Date"
                        type="date"
                        value={saleDate}
                        onChange={handleDateChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Total Price"
                        value={totalPrice.toFixed(2)}
                        fullWidth
                        size="small"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Record Sale
                    </Button>
                </Grid>
            </Grid>
        </form>
      </>
    );
};

export default Sales;
