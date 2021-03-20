import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  InputBase,
  Popover,
  List,
  ListItem,
  ListItemText,
  MenuList,
  MenuItem,
} from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
  fade,
} from '@material-ui/core/styles';
import { Menu, Search } from '@material-ui/icons';
import { SessionContext } from '../providers/SessionProvider';
import { RideOptionsContext } from '../providers/RidesProvider';
import { debounce, getTags } from '../utils/api';
import type { Tag } from '../types';
import AutoCompleteSearch from './AutoCompleteSearch';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginBottom: 60,
      },
      [theme.breakpoints.down('xs')]: {
        marginBottom: 54,
      },
    },
    appBar: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      backgroundColor: '#303030',
      zIndex: 1400,
    },
    toolBar: {
      width: '100%',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    titleContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    title: {
      flexGrow: 1,
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
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
      marginLeft: theme.spacing(5),
    },
    popover: {},
    tagList: {},
    tagContainer: {
      alignItems: 'flex-start',
    },
    tagName: {},
    tagCount: {},
  })
);

type AppBarProps = {
  isOpen: boolean;
  toggleDrawer: (
    toggle: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
};

const TopAppBar = ({ toggleDrawer, isOpen }: AppBarProps) => {
  const classes = useStyles();
  const OptionsContext = useContext(RideOptionsContext);

  // AUTHENTICATION DISPLAY
  const { isAuthenticated } = useContext(SessionContext);
  const auth = isAuthenticated
    ? { path: '/logout', text: 'Logout' }
    : { path: '/login', text: 'Login' };

  // SEARCH HANDLING
  let appBarRef: HTMLDivElement | null = null;
  const [tags, setTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const setAppBarRef = (element: HTMLDivElement) => {
    appBarRef = element;
  };

  const blurTextInput = () => {
    if (appBarRef) {
      setAnchorEl(null);
    }
  };

  const handleSearchInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleanedSearch = input.replace(/\s/g, '');
    setSearch(cleanedSearch);
    setAnchorEl(e.currentTarget);
    if (input !== '') {
      const matchingTags = await getTags(cleanedSearch);
      setTags(matchingTags);
    } else {
      setAnchorEl(null);
    }
  };

  // DRAWER LOGIC
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed" ref={setAppBarRef}>
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
                HELO PELO
              </Typography>
            </div>
          </Box>
          <AutoCompleteSearch />
          <Button
            className={classes.userOptions}
            color="inherit"
            href={auth.path}
          >
            {auth.text}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopAppBar;
