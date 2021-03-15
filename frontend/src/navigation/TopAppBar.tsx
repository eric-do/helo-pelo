import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  InputBase
} from '@material-ui/core';
import { createStyles, makeStyles, Theme, fade } from '@material-ui/core/styles';
import { Menu, Search } from '@material-ui/icons';
import { SessionContext } from '../SessionProvider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: "100%",
      marginBottom: 60
    },
    appBar: {
      justifyContent: "space-between",
      flexDirection: "row",
      backgroundColor: '#303030',
      zIndex: 1400
    },
    toolBar: {
      width: "100%",
      justifyContent: "space-between",
      flexDirection: "row"
    },
    titleContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    title: {
      flexGrow: 1,
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
    userOptions: {
      marginLeft: theme.spacing(5)
    }
  })
);

type AppBarProps = {
  isOpen: boolean,
  toggleDrawer: (toggle: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => void
}

type Search = {
  text: string,
  tags: string[]
  words: string[]
};

const TopAppBar = ({ toggleDrawer, isOpen }: AppBarProps) => {
  const classes = useStyles();
  const { isAuthenticated } = useContext(SessionContext);
  const authUrl = isAuthenticated ? '/logout' : '/login';
  const authText = isAuthenticated ? 'Logout' : 'Login';
  const [search, setSearch] = useState<Search>({ text: '', tags: [], words: []});

  const handleSearchInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = e.target.value;
    const tags = [] as string[];
    const words = [] as string[];
    text.split(' ').forEach(word => {
      if (word[0] === '#') {
        tags.push(word.slice(1));
      } else {
        words.push(word);
      }
    })
    setSearch({ text, tags, words });
  }

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar className={classes.toolBar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(!isOpen)}
          >
            <Menu />
          </IconButton>
          <Box className={classes.titleContainer}>
            <div>
              <Typography variant="h6" className={classes.title}>
              TEST
              </Typography>
            </div>
          </Box>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
            </div>
            <InputBase
              placeholder="Search..."
              value={search.text}
              onChange={handleSearchInput}
              classes={{ input: classes.inputInput }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <Button className={classes.userOptions} color="inherit" href={authUrl}>
            {authText}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default TopAppBar;