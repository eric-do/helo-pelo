import React from 'react';
import {
  AppBar,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@material-ui/core';
import {
  Inbox,
  Menu,
  Mail
} from '@material-ui/icons';
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles
} from '@material-ui/core/styles';

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
      }
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    }
  })
)

type DrawerProps = {
  open: boolean,
  toggleDrawer: (toggle: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => void
}

const ResponsiveDrawer = ({ open, toggleDrawer }: DrawerProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const drawer = (
    <div>
      <div className={classes.toolbar}/>
      <Divider />
      <List>
        {['Tagged Rides', 'Email', 'Test'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon><Inbox /></ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Tagged Rides', 'Email', 'Test'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon><Inbox /></ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <nav className={classes.drawer} aria-label="Site sections">

        <Drawer
          open={open}
          BackdropProps={{ invisible: true }}
          variant="permanent"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          onClose={toggleDrawer(false)}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true
          }}
        >
          {drawer}
        </Drawer>
    </nav>
  )
}

export default ResponsiveDrawer;