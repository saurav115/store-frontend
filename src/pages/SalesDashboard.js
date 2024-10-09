import React, { useEffect, useState } from 'react';
import { getInventoryReport, getWeeklySalesReport } from '../services/api';

const SalesDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const inventoryData = await getInventoryReport();
        setInventory(inventoryData.data);

        const salesData = await getWeeklySalesReport();
        setWeeklySales(salesData.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2>Inventory Report</h2>
      <ul>
        {inventory.map((item) => (
          <li key={item.product_id}>
            {item.product_name}: {item.current_stock} units (Last Updated: {item.last_updated})
          </li>
        ))}
      </ul>

      <h2>Weekly Sales Report</h2>
      <ul>
        {weeklySales.map((sale) => (
          <li key={sale.product_id}>
            Product ID {sale.product_id}: {sale.total_units_sold} units sold
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesDashboard;
