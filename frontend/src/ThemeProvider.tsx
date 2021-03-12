import React from 'react';
import { red, purple, blue } from '@material-ui/core/colors';
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
  Theme,
  useTheme
} from '@material-ui/core/styles';

interface ThemeProviderProps {
  children: React.ReactNode,
  theme: Theme
}

const ThemeDispatchContext = React.createContext<any>(null);

const ThemeProvider = ({ children, theme }: ThemeProviderProps) => {
  const themeInitialOptions = {
    paletteType: 'dark',
    primary: {
      main: purple[200]
    }
  }

  const [themeOptions, dispatch] = React.useReducer(
    (state: any, action: any) => {
      switch(action.type) {
        case 'changeTheme':
          return {
            ...state,
            paletteType: action.payload
          }
        default:
          throw new Error()
      }
    }, themeInitialOptions
  );

  const memoizedTheme = React.useMemo(() => {
    return createMuiTheme({
      ...theme,
      palette: {
        type: themeOptions.paletteType
      }
    })
  }, [themeOptions])

  return (
    <MuiThemeProvider theme={memoizedTheme}>
      <ThemeDispatchContext.Provider value={dispatch}>
        { children }
      </ThemeDispatchContext.Provider>
    </MuiThemeProvider>
  )
}

export default ThemeProvider;

export const useChangeTheme = () => {
  const dispatch = React.useContext(ThemeDispatchContext);
  const theme = useTheme();
  const changeTheme = React.useCallback(() =>
    dispatch({
      type: 'changeTheme',
      payload: theme.palette.type === 'light' ? 'dark' : 'light'
    }),
  [theme.palette.type, dispatch]);

  return changeTheme;
}