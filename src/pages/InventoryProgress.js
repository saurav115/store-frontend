import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getInventoryReport } from '../services/api';

const InventoryProgress = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getInventoryReport();
            setData(result?.data || []);
        };
        fetchData();
    }, []);

    const chartData = {
        labels: data?.map(item => item.productName),
        datasets: [
            {
                label: 'Current Stock',
                data: data?.map(item => item.currentStock),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div>
            <h3>Inventory Progress</h3>
            <Bar data={chartData} />
        </div>
    );
};

export default InventoryProgress;
