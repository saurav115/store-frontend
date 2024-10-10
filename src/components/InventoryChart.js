// src/components/InventoryChart.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getInventoryReport } from '../services/api';
import { Grid, TextField, Button } from '@mui/material';

const InventoryChart = () => {
    const [data, setData] = useState([]);
    const [minStock, setMinStock] = useState(0);
    const [maxStock, setMaxStock] = useState(Infinity);

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const result = await getInventoryReport();
                setData(result?.data || []);
            } catch (error) {
                console.error('Error fetching inventory data:', error);
            }
        };
        fetchInventoryData();
    }, []);

    const filteredData = data.filter(
        item => item.currentStock >= minStock && item.currentStock <= maxStock
    );

    const chartData = {
        labels: filteredData.map(item => item.productName),
        datasets: [
            {
                label: 'Current Stock',
                data: filteredData.map(item => item.currentStock),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div>
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={4} md={3}>
                    <TextField
                        label="Min Stock"
                        type="number"
                        value={minStock}
                        onChange={(e) => setMinStock(Number(e.target.value))}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <TextField
                        label="Max Stock"
                        type="number"
                        value={maxStock === Infinity ? '' : maxStock}
                        onChange={(e) => setMaxStock(Number(e.target.value) || Infinity)}
                        fullWidth
                        size="small"
                    />
                </Grid>                
            </Grid>
            <Bar data={chartData} />
        </div>
    );
};

export default InventoryChart;
