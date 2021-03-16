import React from 'react';
import type { FC } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Routes from './Routes';
import ThemeProvider from './ThemeProvider';
import { SessionProvider } from './SessionProvider';

const App: FC = () => {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <SessionProvider>
        <Routes />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default App;
