import React, { FC } from 'react';
import { Routes } from './Routes';
import ThemeProvider from './ThemeProvider';
import { useTheme } from '@material-ui/core/styles';
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
}


export default App;
