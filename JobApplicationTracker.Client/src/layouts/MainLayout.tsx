/**
 * @file MainLayout.tsx
 * @description Main layout component with navbar and sidebar
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { useState } from 'react';
import { Box } from '@mui/material';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const drawerWidth = 240;

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar onMenuClick={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            sm: `calc(100% - ${sidebarOpen ? drawerWidth : 64}px)`,
          },
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Box sx={{ mt: 8 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
