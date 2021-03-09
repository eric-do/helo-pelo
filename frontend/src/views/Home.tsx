import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getMessage } from '../utils/api';
import { isAuthenticated } from '../utils/auth';
import RideList from './rides/RideList';
import TopAppBar from '../navigation/TopAppBar';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  link: {
    color: '#61dafb',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 40,
    alignItems: 'center'
  }
}));

export const Home: FC = () => {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const classes = useStyles();

  const queryBackend = async () => {
    try {
      const message = await getMessage();
      setMessage(message);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      <TopAppBar/>
      {!message && !error && (
        <a className={classes.link} href="#" onClick={() => queryBackend()}>
          Click to make request to backend
        </a>
      )}
      <Box className={classes.content} >
        <RideList />
        {message && (
          <p>
            <code>{message}</code>
          </p>
        )}
        {error && (
          <p>
            Error: <code>{error}</code>
          </p>
        )}
        <a className={classes.link} href="/admin">
          Admin Dashboard
        </a>
        <a className={classes.link} href="/protected">
          Protected Route
        </a>
        {isAuthenticated() ? (
          <a className={classes.link} href="/logout">
            Logout
          </a>
        ) : (
          <>
            <a className={classes.link} href="/login">
              Login
            </a>
            <a className={classes.link} href="/signup">
              Sign Up
            </a>
          </>
        )}
      </Box>
    </>
  );
};
