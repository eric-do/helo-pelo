import React, { FC, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getRides } from '../../utils/api';

type Comment = {
  comment: string,
  created_at: string,
  user_id: number
}

type Tag = {
  tag_id: number,
  ride_id: number,
  tag_count: number,
  tag: {
    name: string
  }
}

type Ride = {
  description: string,
  ride_id: string,
  difficulty_estimate: number,
  duration: number,
  fitness_discipline_display_name: string,
  image_url: string,
  instructor_id: string,
  title: string
  original_air_time: string
  scheduled_start_time: string
  comments: Comment[],
  tags: Tag[]
};

const RideList: FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [error, setError] = useState<string>('');

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
    <>
      {
        rides ? rides.map(ride => <div>{ride.title}</div>) : null
      }
    </>
  );
}

export default RideList;