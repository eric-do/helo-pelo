import React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

type WrapperProps = {
  children: React.ReactNode;
};

export const LargeWrapper: React.ReactNode = ({ children }: WrapperProps) => {
  const theme = createMuiTheme({
    props: { MuiWithWidth: { initialWidth: 'lg' } },
  });

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export const SmallWrapper: React.ReactNode = ({ children }: WrapperProps) => {
  const theme = createMuiTheme({
    props: { MuiWithWidth: { initialWidth: 'sm' } },
  });

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
