import React, { useState } from 'react';
import { uploadPricingFeed } from '../services/api';
import { Button, Typography, CircularProgress, Box, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles

const ProductUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // State to handle loader

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Validate if the file is a CSV
    if (selectedFile && selectedFile.type !== 'text/csv') {
      toast.error('Please upload a valid CSV file');
      setFile(null); // Reset the file state if it's not a CSV
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file to upload');
      return;
    }
    
    const formData = new FormData();
    formData.append('csvFile', file);
    
    setLoading(true); // Show loader while uploading
    try {
      await uploadPricingFeed(formData);
      toast.success('File uploaded successfully');
      if (onUploadSuccess) {
        onUploadSuccess(); // Trigger the success callback
      }
    } catch (error) {
      console.error('Error uploading file', error);
      toast.error('Error uploading file');
    } finally {
      setLoading(false); // Hide loader after upload
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Upload Pricing Feed
      </Typography>

      {/* Hidden File Input */}
      <input
        id="file-input"
        type="file"
        accept=".csv" // Restrict file selection to CSV
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the default file input
      />

      {/* Icon Button for triggering file input */}
      <IconButton
        color="primary"
        component="span"
        onClick={() => document.getElementById('file-input').click()}
        sx={{ marginBottom: '16px' }}
      >
        <CloudUploadIcon sx={{ fontSize: 50 }} />
      </IconButton>

      {file && <Typography variant="body2">{file.name}</Typography>} {/* Show file name if selected */}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={loading} // Disable the button while loading
        sx={{ marginBottom: '16px' }}
      >
        Upload
      </Button>
      
      {loading && <CircularProgress />} {/* Loader shown during API call */}

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
    </Box>
  );
};

export default ProductUpload;
