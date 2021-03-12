import React, { FC, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { Home, Login, SignUp, Protected, PrivateRoute } from './views';
import { Admin } from './admin';
import { logout } from './utils/auth';
import RideList from './views/rides/RideList';
import TopAppBar from './navigation/TopAppBar'
import Drawer from './navigation/Drawer'

const useStyles = makeStyles((theme) => ({
  app: {
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#1f1f1f',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
  },
}));

export const Routes: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [showDrawer, setDrawer] = useState<boolean>(false)

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
         (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawer(open);
  };

  return (
    <Switch>
      <Route path="/admin">
        <Admin />
      </Route>

      <div className={classes.app}>
        <TopAppBar toggleDrawer={toggleDrawer} isOpen={showDrawer}/>
        <Drawer toggleDrawer={toggleDrawer} open={showDrawer} />
        <header className={classes.header}>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route
            path="/logout"
            render={() => {
              logout();
              history.push('/');
              return null;
            }}
          />
          <PrivateRoute path="/protected" component={Protected} />
          <PrivateRoute path="/rides" component={RideList} />
          <Route exact path="/" component={Home} />
        </header>
      </div>
    </Switch>
  );
};
