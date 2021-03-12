import React, { FC, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Menu } from '@material-ui/icons';
import { isAuthenticated } from '../utils/auth';

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
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
  })
);

type AppBarProps = {
  isOpen: boolean,
  toggleDrawer: (toggle: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => void
}

const TopAppBar = ({ toggleDrawer, isOpen }: AppBarProps) => {
  const classes = useStyles();
  const authUrl = isAuthenticated() ? '/logout' : '/login';
  const authText = isAuthenticated() ? 'Logout' : 'Login';

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
          <Button
            color="inherit"
            href={authUrl}
          >
            {authText}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default TopAppBar;