import React from 'react';
import { Container, Grid, Paper } from '@mui/material';
import InventoryProgress from './InventoryProgress';
import SalesProgress from './SalesProgress';

const Dashboard = () => {
    return (
        <Container maxWidth="lg">
            <h2>Dashboard</h2>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <InventoryProgress />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <SalesProgress />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
