
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './store/store';
import { darkTheme } from './theme/theme';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div style={{ padding: '20px' }}>
          <Dashboard />
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
