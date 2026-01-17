/**
 * @file MainLayout.tsx
 * @description Main layout component with navbar and sidebar
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAppDispatch } from '../redux/store';
import { selectSidebarOpen } from '../redux/selectors/preferences';
import { setSidebarOpen } from '../redux/reducers/preferences/preferences';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const drawerWidth = 240;

  const handleSidebarToggle = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
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
