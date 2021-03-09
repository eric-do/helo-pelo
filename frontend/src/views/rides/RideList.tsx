import React, { FC, useState, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { getRides } from '../../utils/api';
import type { Comment, Tag, Ride } from '../../types';
import RideCard from './RideCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardList: {
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.down('sm')]: {
        width: '90%',
      },
      [theme.breakpoints.up('md')]: {
        width: '60%',
      }
    }
  })
);

const RideList: FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [error, setError] = useState<string>('');
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      try {
        const data = await getRides();
        setRides(data);
      } catch (e) {
        console.log(e)
        setError(e);
      }
    })()
  }, [])

  return (
    <div className={classes.cardList}>
      {
        rides && rides.map(ride => <RideCard ride={ride} key={ride.id}/>)
      }
    </div>
  );
}

export default RideList;