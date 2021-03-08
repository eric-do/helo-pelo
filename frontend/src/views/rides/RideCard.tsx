import React, { FC } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import type { Ride, Tag, Comment } from '../../types';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography
} from '@material-ui/core';
import {
  Favorite,
  Share,
  ExpandMore,
  MoreVert
} from '@material-ui/icons';
import { getLocalStringFromTimeStamp } from '../../utils/datetime'
import { red } from '@material-ui/core/colors';

type RideCardProps = {
  ride: Ride
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginBottom: 20
    },
    avatar: {
      backgroundColor: red[500]
    },
    media: {
      height: 0,
      paddingTop: '56.25%'
    },
    cardHeader: {
      textAlign: 'center'
    },
    cardContent: {
      textAlign: 'left'
    }
  })
);

const RideCard = ({ ride }: RideCardProps) => {
  const classes = useStyles();
  const air_date = getLocalStringFromTimeStamp(ride.original_air_time)

  return(
    <Card className={classes.root}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Avatar
            aria-label="instructor-image"
            className={classes.avatar}
          >
            E
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
        title={ride.title}
        subheader={air_date}
      />
      <CardMedia
        className={classes.media}
        image={ride.image_url}
        title={ride.title}
      />
      <CardContent>
        <Typography
          className={classes.cardContent}
          variant="body2"
          color="textSecondary"
          component="p"
        >
          {ride.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default RideCard;