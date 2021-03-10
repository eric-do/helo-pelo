import React, { FC, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import type { Ride, Tag, Comment } from '../../types';
import clsx from 'clsx';
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
  Box,
  List,
  ListItem,
  ListItemText,
  Divider
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
import { getRide, addComment } from '../../utils/api'
import { logout } from '../../utils/auth';

type RideCardProps = {
  ride: Ride
};

const bodyFontColor = 'white';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    rideCard: {
      width: "100%",
      marginTop: 20,
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
      fontWeight: 600,
      fontSize: 15,
      color: bodyFontColor
    },
    cardSubheader: {
      textAlign: 'center',
      color: bodyFontColor,
      fontSize: 12
    },
    cardContent: {
      textAlign: 'left',
      color: bodyFontColor,
      marginBottom: 10
    },
    iconButton: {
      color: blue[200],
      "&:hover, &.Mui-focusVisible": { backgroundColor: 'rgba(255,255,255,0.12)' }
    },
    icon: {
      color: bodyFontColor
    },
    tagForm: {
      width: '100%',
      '& label.Mui-unfocused': {
        color: bodyFontColor,
      },
      '& label.Mui-focused': {
        color: blue[200],
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: blue[200],
      },
    },
    formInput: {
      color: bodyFontColor,
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
      '&:hover, &:focus': {
        backgroundColor: blue[400],
      },
      '&:active': {
        backgroundColor: blue[500],
      },
    },
    badge: {
      backgroundColor: red[200]
    },
    addTag: {
      marginLeft: 5
    },
    commentList: {
      width: '95%',
      backgroundColor: 'rgba(255,255,255,0.05)'
    },
    commentUser: {
      fontWeight: 600,
      color: bodyFontColor
    },
    commentText: {
      color: bodyFontColor
    },
    commentListFooter: {
      color: bodyFontColor,
      display: 'flex',
      justifyContent:'center',
      fontSize: 14,
      marginTop: 5
    }
  })
);

const RideCard = ({ ride: rideProp }: RideCardProps) => {
  const classes = useStyles();
  const initialCommentCount = Math.min(rideProp.comments.length, 2);
  const initialPlaceholder = 'Add tag(s)';
  const [placeholder, setPlaceholder] = useState<string>(initialPlaceholder);
  const [comment, setComment] = useState<string>('');
  const [ride, setRide] = useState<Ride>(rideProp);
  const [error, setError] = useState<Error | null>(null);
  const [commentCount, setCommentCount] = useState<number>(initialCommentCount);
  const clearPlaceholder = () => setPlaceholder('');
  const resetPlaceholder = () => setPlaceholder(initialPlaceholder);

  const handleCommentInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setComment(event.target.value);

  const handleCommentSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await addComment(ride.id, comment);
      const updatedRide = await getRide(ride.id);
      setRide(updatedRide);
    } catch(err) {
      if (err.response.status === 401) {
        setError(err)
        logout();
      }
    }
  }

  const loadMoreComments = () => setCommentCount(commentCount + 5);
  const resetComments = () => setCommentCount(initialCommentCount);

  const air_date = getLocalStringFromTimeStamp(ride.original_air_time)

  return(
    <Box className={classes.root}>
      <Card className={classes.rideCard}>
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
          title={<Typography className={classes.cardHeader}>{ride.title}</Typography>}
          subheader={<Typography className={classes.cardSubheader}>{air_date}</Typography>}
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
                <Badge
                  classes={{badge: classes.badge}}
                  overlap="circle"
                  badgeContent={tag.tag_count}
                  max={999}
                  key={tag.tag.name}
                >
                    <Chip
                      className={classes.currentTag}
                      label={`#${tag.tag.name}`}
                      clickable
                    />
                </Badge>
              ))
            }
            <Chip
              className={clsx(classes.currentTag, classes.addTag)}
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
          <form
            noValidate
            autoComplete="off"
            onSubmit={handleCommentSubmit}
          >
            <TextField
              className={classes.tagForm}
              color="secondary"
              id="add-comment"
              onFocus={clearPlaceholder}
              onBlur={resetPlaceholder}
              placeholder={placeholder}
              InputProps={{ className: classes.formInput }}
              value={comment}
              onChange={handleCommentInput}
            />
          </form>
        </CardContent>
      </Card>
      {
        ride.comments.length > 0 &&
        <List className={classes.commentList}>
          {
            ride.comments.slice(0, commentCount).map(({ comment }, i) => (
              <>
                <ListItem key={i}>
                  <ListItemText
                    primary={<Typography className={classes.commentUser}>User</Typography>}
                    secondary={<Typography className={classes.commentText}>{comment}</Typography>}
                    onClick={() => console.log('hi')}
                  />
                </ListItem>
                <Divider component="li" />
              </>
            ))
          }
          {
            commentCount < ride.comments.length &&
            <Box className={classes.commentListFooter}>
              <span onClick={loadMoreComments}>See more comments</span>
            </Box>
          }
          {
            commentCount >= ride.comments.length && commentCount > initialCommentCount &&
            <Box className={classes.commentListFooter}>
              <span onClick={resetComments}>Hide comments</span>
            </Box>
          }
        </List>
      }
    </Box>
  );
}

export default RideCard;