import React, { FC, useState } from 'react';
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
  Typography,
  TextField,
  Chip,
  Badge,
  Box
} from '@material-ui/core';
import {
  Favorite,
  Share,
  ExpandMore,
  MoreVert,
  Add
} from '@material-ui/icons';
import { getLocalStringFromTimeStamp } from '../../utils/datetime'
import { red, purple, blue } from '@material-ui/core/colors';

type RideCardProps = {
  ride: Ride
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginBottom: 20,
      backgroundColor: 'rgba(255,255,255,0.05)'
    },
    avatar: {
      backgroundColor: red[500]
    },
    media: {
      height: 0,
      paddingTop: '56.25%'
    },
    cardHeader: {
      textAlign: 'center',
      color: 'white'
    },
    cardSubheader: {
      textAlign: 'center',
      color: 'white',
      fontSize: 12
    },
    cardContent: {
      textAlign: 'left',
      color: 'white',
      marginBottom: 10
    },
    iconButton: {
      color: blue[200],
      "&:hover, &.Mui-focusVisible": { backgroundColor: 'rgba(255,255,255,0.12)' }
    },
    icon: {
      color: 'white'
    },
    tagForm: {
      width: '100%',
      '& label.Mui-unfocused': {
        color: 'white',
      },
      '& label.Mui-focused': {
        color: blue[200],
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: blue[200],
      },
    },
    formInput: {
      color: 'white',
    },
    tagContinaer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    },
    currentTag: {
      backgroundColor: blue[200],
      marginRight: 10,
      marginBottom: 10,
    }
  })
);

const RideCard = ({ ride }: RideCardProps) => {
  const initialPlaceholder = 'Add tag(s)';
  const [placeholder, setPlaceholder] = useState<string>(initialPlaceholder);
  const [label, setLabel] = useState<string>('')
  const classes = useStyles();
  const air_date = getLocalStringFromTimeStamp(ride.original_air_time)
  const clearPlaceholder = () => setPlaceholder('');
  const resetPlaceholder = () => setPlaceholder(initialPlaceholder);

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
          <IconButton className={classes.iconButton} aria-label="settings">
            <MoreVert className={classes.icon}/>
          </IconButton>
        }
        title={ride.title}
        subheader={<Typography className={classes.cardSubheader}>{air_date}</Typography>}
        // subheader={air_date}
      />
      <CardMedia
        className={classes.media}
        image={ride.image_url}
        title={ride.title}
      />
      <CardContent>
        <Box className={classes.tagContinaer}>
          {
            ride.tags.length > 0 && ride.tags.map(tag => (
              <Badge color="secondary" overlap="circle" badgeContent={tag.tag_count} max={999}>
                  <Chip className={classes.currentTag} label={tag.tag.name} />
              </Badge>
            ))
          }
          <Chip
            className={classes.currentTag}
            label="Tag"
            icon={<Add />}
          />
        </Box>
        <Typography
          className={classes.cardContent}
          variant="body2"
          color="textSecondary"
          component="p"
        >
          {ride.description}
        </Typography>
        <form noValidate autoComplete="off">
          <TextField
            className={classes.tagForm}
            color="secondary"
            id="add-tag"
            onFocus={clearPlaceholder}
            onBlur={resetPlaceholder}
            placeholder={placeholder}
            InputProps={{ className: classes.formInput }}
          />
        </form>
      </CardContent>
    </Card>
  );
}

export default RideCard;