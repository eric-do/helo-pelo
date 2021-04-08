import React, { FC, useState, useEffect, useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Paper, Box, CircularProgress, Modal } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { getRides } from '../../utils/api';
import type { Comment, Tag, Ride } from '../../types';
import RideCard from './RideCard';
import { SessionContext } from '../../providers/SessionProvider';
import { RideOptionsContext } from '../../providers/RidesProvider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardList: {
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.down('sm')]: {
        width: '94%',
      },
      [theme.breakpoints.up('md')]: {
        width: '60%',
      },
    },
  })
);

const RideList: FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [error, setError] = useState<string>('');
  const [isPending, setPending] = useState<boolean>(false);
  const classes = useStyles();
  const { isAuthenticated } = useContext(SessionContext);
  const { options, setOptions } = useContext(RideOptionsContext);

  useEffect(() => {
    setPending(true);
    (async () => {
      try {
        const data = await getRides(options);
        setPending(false);
        setRides(data);
      } catch (e) {
        setError(e);
      }
    })();
  }, [options]);

  return (
    <>
      {error && <Box>{error}</Box>}
      {isPending && <CircularProgress />}
      {!error && !isPending && (
        <div className={classes.cardList}>
          {rides && rides.map((ride) => <RideCard ride={ride} key={ride.id} />)}
        </div>
      )}
    </>
  );
};

export default RideList;
