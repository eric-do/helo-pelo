import React, { FC } from 'react';
import { Routes } from './Routes';
import ThemeProvider from './ThemeProvider';
import { useTheme } from '@material-ui/core/styles';

const App: FC = () => {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  );
}


export default App;
