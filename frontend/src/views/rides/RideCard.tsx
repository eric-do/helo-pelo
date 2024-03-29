import React, { FC, useState, useContext, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Chip,
  Badge,
  Box,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { red, purple, blue } from '@material-ui/core/colors';
import { getLocalStringFromTimeStamp } from '../../utils';
import type { Ride, Tag, Comment } from '../../types';
import {
  getRide,
  getRideComments,
  getRideTags,
  addComment,
} from '../../utils/api';
import { logout } from '../../utils/auth';
import { SessionContext } from '../../providers/SessionProvider';
import { RideOptionsContext } from '../../providers/RidesProvider';
import RideComments from './RideComments';

type RideCardProps = {
  ride: Ride;
};

const primaryBrandColor = blue[200];
const secondaryBrandColor = red[200];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    rideCard: {
      width: '100%',
      marginTop: 20,
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    avatar: {
      backgroundColor: red[500],
    },
    media: {
      height: 0,
      paddingTop: '56.25%',
    },
    cardHeader: {
      textAlign: 'center',
      fontWeight: 600,
      fontSize: 15,
      color: theme.palette.text.primary,
    },
    cardSubheader: {
      textAlign: 'center',
      color: theme.palette.text.primary,
      fontSize: 12,
    },
    cardContent: {
      textAlign: 'left',
      color: theme.palette.text.primary,
      marginBottom: 10,
    },
    iconButton: {
      color: primaryBrandColor,
      '&:hover, &.Mui-focusVisible': {
        backgroundColor: 'rgba(255,255,255,0.12)',
      },
    },
    icon: {
      color: theme.palette.text.primary,
    },
    tagForm: {
      width: '100%',
      '& label.Mui-unfocused': {
        color: theme.palette.text.primary,
      },
      '& label.Mui-focused': {
        color: primaryBrandColor,
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: primaryBrandColor,
      },
    },
    formInput: {
      color: theme.palette.text.primary,
    },
    tagContinaer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    currentTag: {
      backgroundColor: primaryBrandColor,
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
      backgroundColor: secondaryBrandColor,
    },
    addTag: {
      marginLeft: 5,
    },
  })
);

const RideCard = ({ ride: rideProp }: RideCardProps) => {
  const initialCommentCount = 2;
  const classes = useStyles();
  const [comments, setComments] = useState<Comment[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const initialPlaceholder = 'Add tag(s)';
  const [placeholder, setPlaceholder] = useState<string>(initialPlaceholder);
  const [comment, setComment] = useState<string>('');
  const [commentCount, setCommentCount] = useState<number>(0);
  const [ride, setRide] = useState<Ride>(rideProp);
  const [authError, setAuthError] = useState<Error | null>(null);
  const { updateAuthentication } = useContext(SessionContext);
  const { setOptions } = useContext(RideOptionsContext);

  const clearPlaceholder = () => setPlaceholder('');
  const resetPlaceholder = () => setPlaceholder(initialPlaceholder);

  const clearComment = () => setComment('');

  const handleCommentInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    setComment(event.target.value);

  const handleCommentSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await addComment(ride.id, comment);
      const updatedRide = await getRide(ride.id);
      setRide(updatedRide);
      clearComment();
    } catch (err) {
      console.log(err);
      if (err.status === 401) {
        updateAuthentication();
        logout();
        setAuthError(err);
      }
    }
  };

  const airDate = getLocalStringFromTimeStamp(ride.original_air_time);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const commentsFromAPI = await getRideComments(ride.id);
      const tagsFromAPI = await getRideTags(ride.id);
      if (mounted) {
        setComments(commentsFromAPI);
        setCommentCount(Math.min(commentsFromAPI.length, 2));
        setTags(tagsFromAPI);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [ride]);

  return (
    <Box className={classes.root}>
      <Card className={classes.rideCard}>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Avatar aria-label="instructor-image" className={classes.avatar}>
              E
            </Avatar>
          }
          action={
            <IconButton className={classes.iconButton} aria-label="settings">
              <MoreVert className={classes.icon} />
            </IconButton>
          }
          title={
            <Typography className={classes.cardHeader}>{ride.title}</Typography>
          }
          subheader={
            <Typography className={classes.cardSubheader}>{airDate}</Typography>
          }
        />
        <CardMedia
          className={classes.media}
          image={ride.image_url}
          title={ride.title}
        />
        <CardContent>
          <Box className={classes.tagContinaer}>
            {tags.length > 0 &&
              tags.map((tag) => (
                <Badge
                  classes={{ badge: classes.badge }}
                  overlap="circle"
                  badgeContent={tag.tag_count}
                  max={999}
                  key={tag.name}
                >
                  <Chip
                    className={classes.currentTag}
                    label={`#${tag.name}`}
                    onClick={() => setOptions({ tag: tag.name })}
                    clickable
                  />
                </Badge>
              ))}
          </Box>
          <Typography
            className={classes.cardContent}
            variant="body2"
            color="textSecondary"
            component="p"
          >
            {ride.description}
          </Typography>
          <form noValidate autoComplete="off" onSubmit={handleCommentSubmit}>
            <TextField
              className={classes.tagForm}
              color="secondary"
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
      {comments.length > 0 && <RideComments comments={comments} />}
    </Box>
  );
};

export default RideCard;
