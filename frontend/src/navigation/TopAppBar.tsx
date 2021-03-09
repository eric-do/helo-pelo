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
    },
    appBar: {
      justifyContent: "space-between",
      flexDirection: "row"
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

const TopAppBar: FC = props => {
  const classes = useStyles();
  const authUrl = isAuthenticated() ? '/logout' : '/login';
  const authText = isAuthenticated() ? 'Logout' : 'Login';

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar className={classes.toolBar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu">
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