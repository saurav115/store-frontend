import React from 'react';
import { Container, Grid, Paper } from '@mui/material';
import InventoryChart from '../components/InventoryChart';
import SalesProgressChart from '../components/SalesProgressChart';

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <h2>Dashboard</h2>

      <Paper elevation={3} style={{ padding: '20px', marginBottom: '30px' }}>
        <h3>Inventory</h3>
        <InventoryChart />
      </Paper>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '30px' }}>
        <h3>Sales</h3>
        <SalesProgressChart />
      </Paper>

    </Container>
  );
};

export default Dashboard;
