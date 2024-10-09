// src/components/SalesProgress.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getSalesReport } from '../services/api';
import DateRangePicker from '../components/DateRangePicker';

const SalesProgress = () => {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchSalesData = async () => {
        try {
            const result = await getSalesReport({ startDate, endDate });
            setData(result?.data || []);
        } catch (error) {
            console.error('Error fetching sales data:', error);
            setData([]);
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchSalesData();
        }
    }, [startDate, endDate]);

    const chartData = {
        labels: data.map(item => item.saleDate || item.productName),
        datasets: [
            {
                label: 'Units Sold',
                data: data.map(item => item.totalUnitsSold),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    };

    return (
        <div>
            <h3>Sales Progress</h3>
            <DateRangePicker label="Start Date" value={startDate} onChange={setStartDate} />
            <DateRangePicker label="End Date" value={endDate} onChange={setEndDate} />
            <Line data={chartData} />
        </div>
    );
};

export default SalesProgress;
