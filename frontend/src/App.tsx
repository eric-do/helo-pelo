import React from 'react';
import type { FC } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Routes from './Routes';
import ThemeProvider from './providers/ThemeProvider';
import { SessionProvider } from './providers/SessionProvider';
import { RideOptionsProvider } from './providers/RidesProvider';

const App: FC = () => {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <SessionProvider>
        <RideOptionsProvider>
          <Routes />
        </RideOptionsProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default App;
