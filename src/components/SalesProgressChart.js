// src/components/SalesProgressChart.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getSalesReport, getAllStores } from '../services/api';
import { TextField, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material'; // Make sure to use this import

const SalesProgressChart = () => {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [storeId, setStoreId] = useState('');
    const [timeFrame, setTimeFrame] = useState('daily'); // 'daily', 'weekly', or 'monthly'
    const [stores, setStores] = useState([]);
    const [viewMode, setViewMode] = useState('units'); // 'units' or 'revenue'

    useEffect(() => {
        // Fetch store options for the filter
        const fetchStores = async () => {
            const storesData = await getAllStores();
            setStores(storesData?.data || []);
        };
        fetchStores();
    }, []);

    useEffect(() => {
        // Fetch sales data whenever the filters change
        const fetchSalesData = async () => {
            try {
                const result = await getSalesReport({ startDate, endDate, storeId, timeFrame });
                setData(result?.data || []);
            } catch (error) {
                console.error('Error fetching sales data:', error);
                setData([]);
            }
        };
        fetchSalesData();
    }, [startDate, endDate, storeId, timeFrame]);

    const chartData = {
        labels: data.map(item => item.timeFrame), // Use the aggregated time frame
        datasets: [
            {
                label: viewMode === 'units' ? 'Total Units Sold' : 'Total Revenue',
                data: viewMode === 'units' ? data.map(item => item.totalUnitsSold) : data.map(item => item.totalRevenue),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
            }
        ],
    };

    return (
        <div>
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Store</InputLabel>
                        <Select
                            value={storeId}
                            onChange={(e) => setStoreId(e.target.value)}
                            label="Store"
                        >
                            <MenuItem value="">
                                <em>All Stores</em>
                            </MenuItem>
                            {stores.map(store => (
                                <MenuItem key={store.storeId} value={store.storeId}>
                                    {store.storeName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Time Frame</InputLabel>
                        <Select
                            value={timeFrame}
                            onChange={(e) => setTimeFrame(e.target.value)}
                            label="Time Frame"
                        >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                        <InputLabel>View Mode</InputLabel>
                        <Select
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value)}
                            label="View Mode"
                        >
                            <MenuItem value="units">Units Sold</MenuItem>
                            <MenuItem value="revenue">Revenue</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Line data={chartData} />
        </div>
    );
};

export default SalesProgressChart;
