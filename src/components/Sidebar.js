import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Store as ProductsIcon,
  MonetizationOn as SalesIcon,
  UploadFile as UploadIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';

// Extracted styles
const drawerStyles = (open) => ({
  width: open ? 240 : 60,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: open ? 240 : 60,
    boxSizing: 'border-box',
    backgroundColor: '#04315d',
    color: 'white',
  },
});

const menuButtonStyles = (open) => ({
  display: 'flex',
  justifyContent: open ? 'space-between' : 'center',
  padding: '10px',
});

const iconStyles = {
  color: 'white',
};

const listItemStyles = (isSelected) => ({
  backgroundColor: isSelected ? '#06182d' : 'transparent',
  color: 'white',
  '&:hover': {
    backgroundColor: '#124886',
    color: 'white'
  },
  '&:active': {
    color: 'white'
  },
  '&:click': {
    color: 'white'
  },
  '&:focus': {
    color: 'white'
  }
});

const Sidebar = () => {
  const location = useLocation(); // To track current route for highlighting
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer variant="permanent" open={open} sx={drawerStyles(open)}>
      <div style={menuButtonStyles(open)}>
        {open && <Typography variant="h6">Retail Management</Typography>}
        <IconButton onClick={toggleDrawer} sx={iconStyles}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem
          button
          component={Link}
          to="/"
          selected={location.pathname === '/'}
          sx={listItemStyles(location.pathname === '/')}
        >
          <ListItemIcon sx={iconStyles}>
            <DashboardIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Dashboard" />}
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/products"
          selected={location.pathname === '/products'}
          sx={listItemStyles(location.pathname === '/products')}
        >
          <ListItemIcon sx={iconStyles}>
            <ProductsIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Products" />}
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/sales"
          selected={location.pathname === '/sales'}
          sx={listItemStyles(location.pathname === '/sales')}
        >
          <ListItemIcon sx={iconStyles}>
            <SalesIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Sales" />}
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/upload"
          selected={location.pathname === '/upload'}
          sx={listItemStyles(location.pathname === '/upload')}
        >
          <ListItemIcon sx={iconStyles}>
            <UploadIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Upload" />}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
