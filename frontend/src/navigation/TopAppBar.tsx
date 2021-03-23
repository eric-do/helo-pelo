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
  ListItemIcon,
  MenuList,
  MenuItem,
} from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
  fade,
} from '@material-ui/core/styles';
import {
  Menu,
  Settings,
  Search,
  MoreVert,
  ExitToApp,
  Person,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
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
      [theme.breakpoints.up('md')]: {
        marginBottom: 60,
      },
      [theme.breakpoints.down('sm')]: {
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
      color: theme.palette.primary.main,
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
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
    popover: {
      marginTop: 4,
    },
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

  // MENU LOGIC
  let appBarRef: HTMLButtonElement | null = null;
  const [tags, setTags] = useState<Tag[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setAppBarRef = (element: HTMLButtonElement) => {
    appBarRef = element;
  };

  const open = Boolean(anchorEl);
  const id = open ? 'menu-popover' : undefined;

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
              <Link to="/">
                <Typography variant="h6" className={classes.title}>
                  HELO PELO
                </Typography>
              </Link>
            </div>
          </Box>
          <AutoCompleteSearch />
          <IconButton
            edge="start"
            aria-describedby={id}
            aria-label="User menu"
            onClick={handleClick}
            className={classes.userOptions}
            color="inherit"
          >
            <MoreVert />
          </IconButton>
          <Popover
            className={classes.popover}
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <List>
              <ListItem button component="a" href="/profile">
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItem>
              <ListItem button component="a" href={auth.path}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Sign out" />
              </ListItem>
            </List>
          </Popover>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopAppBar;
