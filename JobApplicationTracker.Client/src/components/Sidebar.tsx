/**
 * @file Sidebar.tsx
 * @description Sidebar navigation component
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { useAppDispatch } from '../redux/store';
import { resetPreferences } from '../redux/reducers/preferences/preferences';

interface SidebarItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: SidebarItem[] = [
  {
    text: 'Job Applications',
    path: '/job-applications',
    icon: <WorkIcon />,
  },
];

interface SidebarProps {
  open: boolean;
  drawerWidth: number;
}

const Sidebar = ({ open, drawerWidth }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleResetPreferencesClick = () => {
    setResetDialogOpen(true);
  };

  const handleResetDialogClose = () => {
    setResetDialogOpen(false);
  };

  const handleResetConfirm = () => {
    dispatch(resetPreferences());
    setResetDialogOpen(false);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 64,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 64,
          boxSizing: 'border-box',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: open ? 1 : 0,
                  display: open ? 'block' : 'none',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 'auto' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleResetPreferencesClick}
            sx={{
              minHeight: 32,
              justifyContent: open ? 'initial' : 'center',
              px: 2,
              py: 0.25,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : 'auto',
                justifyContent: 'center',
                '& svg': {
                  fontSize: '1.2rem',
                },
              }}
            >
              <SettingsBackupRestoreIcon />
            </ListItemIcon>
            <ListItemText
              primary="Reset Preferences"
              sx={{
                opacity: open ? 1 : 0,
                display: open ? 'block' : 'none',
                '& .MuiListItemText-primary': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Dialog open={resetDialogOpen} onClose={handleResetDialogClose}>
        <DialogTitle>Reset Preferences</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset all preferences to their default values?
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, mb: 1 }}>
            The following preferences will reset to:
          </DialogContentText>
          <DialogContentText component="div" sx={{ pl: 2 }}>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Page Size: 5</li>
              <li>Current Page: 1</li>
              <li>Sidebar State: Open</li>
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleResetConfirm} color="error" variant="contained">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default Sidebar;
