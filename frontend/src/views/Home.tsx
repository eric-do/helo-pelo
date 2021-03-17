import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { isAuthenticated } from '../utils/auth';
import RideList from './rides/RideList';

const useStyles = makeStyles((theme) => ({
  link: {
    color: '#61dafb',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    // marginTop: 40,
    alignItems: 'center',
  },
}));

export const Home: FC = () => {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.content}>
        <RideList />
        <a className={classes.link} href="/admin">
          Admin Dashboard
        </a>
      </Box>
    </>
  );
};
