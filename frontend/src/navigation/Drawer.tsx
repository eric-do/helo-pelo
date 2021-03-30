import React, { useEffect, useState, useContext } from 'react';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Hidden,
  Typography,
} from '@material-ui/core';
import { Inbox, Person, DirectionsBike } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
  styled,
} from '@material-ui/core/styles';
import { RideOptionsContext } from '../providers/RidesProvider';
import { getTags } from '../utils/api';
import type { Tag } from '../types';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      backgroundColor: '#2e2e2e',
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
}));

type DrawerProps = {
  open: boolean;
  toggleDrawer: (
    toggle: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
};

const routes = [
  {
    name: 'Profile',
    path: '/profile',
    icon: <Person />,
  },
  {
    name: 'RideFeed',
    path: '/rides',
    icon: <DirectionsBike />,
  },
];

const ResponsiveDrawer = ({ open, toggleDrawer }: DrawerProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const [tags, setTags] = useState<Tag[]>([]);
  const { setOptions } = useContext(RideOptionsContext);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const tagList = await getTags();
      if (mounted) {
        setTags(tagList);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {routes.map((route) => (
          <NavLink to={route.path} key={route.name}>
            <ListItem button onClick={() => setOptions({ tag: '' })}>
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItem>
          </NavLink>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem key="trending">
          <ListItemText primary="Trending Tags" />
        </ListItem>
        {tags.map((tag) => (
          <NavLink to="/rides" key={tag.name}>
            <ListItem button onClick={() => setOptions({ tag: tag.name })}>
              <ListItemText
                primary={`#${tag.name}`}
                secondary={`${tag.tag_count} ${
                  tag.tag_count > 1 ? 'rides' : 'ride'
                }`}
              />
            </ListItem>
          </NavLink>
        ))}
      </List>
    </div>
  );

  return (
    <nav className={classes.drawer} aria-label="Site sections">
      <Hidden mdUp>
        <Drawer
          open={open}
          BackdropProps={{ invisible: true }}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          onClose={toggleDrawer(false)}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
};

export default ResponsiveDrawer;
