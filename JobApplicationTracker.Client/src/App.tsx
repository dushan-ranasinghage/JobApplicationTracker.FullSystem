/**
 * @file App.tsx
 * @description Main application component
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';

import { store, persistor } from './redux/store';
import AppRoutes from './routes/AppRoutes';

const theme = createTheme();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
