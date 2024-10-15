import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Box, MenuItem, Select, Checkbox, ListItemText, InputLabel, FormControl, IconButton, Modal, Fab, InputBase, Divider } from '@mui/material';
import { searchProducts, getAllStores, getAllCategories } from '../services/api';
import ProductUpload from './ProductUpload'; // Import Product Upload component
import ProductEdit from './ProductEdit'; // Import Product Edit component
import EditIcon from '@mui/icons-material/Edit'; // Import Edit Icon
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const Products = () => {
  const [products, setProducts] = useState([]); // State to store fetched products
  const [stores, setStores] = useState([]); // State to store available stores
  const [categories, setCategories] = useState([]); // State to store available categories
  const [filters, setFilters] = useState({
    productName: '',
    selectedStores: [],
    selectedCategories: [],
    minPrice: '',
    maxPrice: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0); // Total number of products for pagination
  const [openUpload, setOpenUpload] = useState(false); // Modal open/close state for upload
  const [openEdit, setOpenEdit] = useState(false); // Modal open/close state for edit
  const [selectedProduct, setSelectedProduct] = useState(null); // Product selected for editing

  // Fetch stores and categories when the component mounts
  useEffect(() => {
    const fetchStoresAndCategories = async () => {
      try {
        const storeResponse = await getAllStores();
        const categoryResponse = await getAllCategories();
        setStores(storeResponse.data);
        setCategories(categoryResponse.data);
      } catch (error) {
        console.error('Error fetching stores or categories:', error);
      }
    };
    fetchStoresAndCategories();
  }, []);

  // Fetch products when filters change or pagination changes
  const fetchProducts = async () => {
    try {
      const query = filters.productName || '';
      const storeIds = filters.selectedStores.join(',');
      const categories = filters.selectedCategories.join(',');
      const response = await searchProducts(query, storeIds, categories, filters.minPrice, filters.maxPrice, page + 1, rowsPerPage);
      setProducts(response.data.results); // Set the fetched products
      setTotalProducts(response.data.total); // Set total number of products for pagination
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch products on component mount and whenever filters, page, or rowsPerPage change
  useEffect(() => {
    fetchProducts();
  }, [filters, page, rowsPerPage]);

  const getStoreNameById = (id) => {
    return stores?.filter(s => s.storeId == id)[0]?.storeName || "Other";
  } 
  // Handle change in pagination (page and rows per page)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to the first page when rows per page changes
  };

  // Handle filter changes
  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  // Function to open the upload modal
  const handleOpenUpload = () => setOpenUpload(true);

  // Function to close the upload modal
  const handleCloseUpload = () => setOpenUpload(false);

  // Function to open the edit modal
  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setOpenEdit(true);
  };

  // Function to close the edit modal
  const handleCloseEdit = () => setOpenEdit(false);

  // Callback for successful upload to refresh product list
  const handleUploadSuccess = () => {
    handleCloseUpload(); // Close the modal
    fetchProducts(); // Refresh product list after successful upload
  };

  // Callback for successful edit to refresh product list
  const handleEditSuccess = () => {
    handleCloseEdit(); // Close the modal
    fetchProducts(); // Refresh product list after successful edit
  };

  return (
    <Box>
    
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>

        <Paper
          component="form"
          sx={{ display: 'flex', alignItems: 'center', width: 700, padding: '8px' }}
        >
          {/* Store Filter */}
          <FormControl sx={{ minWidth: 150, flex: 1 }} size="small">
            <InputLabel>Stores</InputLabel>
            <Select
              label="Stores"
              name="selectedStores"
              multiple
              value={filters.selectedStores}
              onChange={handleFilterChange}
              renderValue={(selected) =>
                selected
                  .map((storeId) => {
                    const store = stores.find((s) => s.storeId === storeId);
                    return store ? store.storeName : '';
                  })
                  .join(', ')
              }
            >
              {stores.map((store) => (
                <MenuItem key={store.storeId} value={store.storeId}>
                  <Checkbox checked={filters.selectedStores.indexOf(store.storeId) > -1} />
                  <ListItemText primary={store.storeName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ height: 28, m: 1 }} orientation="vertical" />

          {/* Category Filter */}
          <FormControl sx={{ minWidth: 150, flex: 1 }} size="small">
            <InputLabel>Categories</InputLabel>
            <Select
              label="Categories"
              name="selectedCategories"
              multiple
              value={filters.selectedCategories}
              onChange={handleFilterChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  <Checkbox checked={filters.selectedCategories.indexOf(category) > -1} />
                  <ListItemText primary={category} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ height: 28, m: 1 }} orientation="vertical" />

          {/* Price Range Filters */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <TextField
              label="Min Price"
              name="minPrice"
              size="small"
              type="number"
              value={filters.minPrice}
              onChange={handleFilterChange}
              variant="outlined"
              sx={{ width: '100px' }}
            />
            <TextField
              label="Max Price"
              name="maxPrice"
              size="small"
              type="number"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              variant="outlined"
              sx={{ width: '100px' }}
            />
          </Box>
        </Paper>

        <Paper
          component="form"
          sx={{ display: 'flex', alignItems: 'center', minWidth: 300 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Product"
            inputProps={{ 'aria-label': 'search product' }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton color="secondary" sx={{ p: '10px' }} aria-label="Upload Product" onClick={handleOpenUpload}>
            <AddIcon color="secondary" />
          </IconButton>
        </Paper>
    
      </Box>

      {/* Modal for Product Upload */}
      <Modal
        open={openUpload}
        onClose={handleCloseUpload}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ width: 600, padding: 1, backgroundColor: 'white', margin: '50px auto', borderRadius: 2 }}>
          <ProductUpload onUploadSuccess={handleUploadSuccess} />
        </Box>
      </Modal>

      {/* Modal for Product Edit */}
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={{ width: 500, padding: 4, backgroundColor: 'white', margin: '50px auto', borderRadius: 2 }}>
          <ProductEdit product={selectedProduct} onEditSuccess={handleEditSuccess} onClose={handleCloseEdit} stores={stores} categories={categories} />
        </Box>
      </Modal>

      {/* Product Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Store ID</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product['Prod ID']}>
                  <TableCell>{product['Product Name']}</TableCell>
                  <TableCell>{product['SKU']}</TableCell>
                  <TableCell>Rs{product['Price']}</TableCell>
                  <TableCell>{getStoreNameById(product['Store ID'])}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenEdit(product)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={totalProducts} // Total number of products for pagination
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default Products;
