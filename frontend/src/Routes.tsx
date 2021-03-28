import React, { useContext } from 'react';
import type { FC } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { Home, Login, SignUp, Protected, PrivateRoute } from './views';
import { Admin } from './admin';
import { logout } from './utils/auth';
import Profile from './views/Profile';
import RideList from './views/rides/RideList';
import Navigation from './navigation/Navigation';
import { SessionContext } from './providers/SessionProvider';

const useStyles = makeStyles(() => ({
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

const Routes: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { isAuthenticated } = useContext(SessionContext);

  return (
    <Switch>
      <Route path="/admin">
        <Admin />
      </Route>

      <div className={classes.app}>
        {isAuthenticated && <Navigation />}
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
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute exact path="/" component={Home} />
        </header>
      </div>
    </Switch>
  );
};

export default Routes;
