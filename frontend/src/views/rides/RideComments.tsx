import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';
import type { Tag, Comment } from '../../types';

type RideCardProps = {
  comments: Comment[];
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    commentList: {
      width: '97%',
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    commentUser: {
      fontWeight: 600,
      color: theme.palette.text.primary,
    },
    commentText: {
      color: theme.palette.text.primary,
    },
    commentListFooter: {
      color: theme.palette.text.primary,
      display: 'flex',
      justifyContent: 'center',
      fontSize: 14,
      marginTop: 5,
      cursor: 'pointer',
    },
  })
);

const RideComments = ({ comments }: RideCardProps) => {
  const initialCommentCount = 2;
  const classes = useStyles();
  const [commentCount, setCommentCount] = useState<number>(
    Math.min(comments.length, initialCommentCount)
  );
  const loadMoreComments = () => setCommentCount(commentCount + 5);
  const resetComments = () => setCommentCount(initialCommentCount);

  return (
    <>
      {comments.length > 0 && (
        <List className={classes.commentList}>
          {comments.slice(0, commentCount).map((comment, i) => (
            <div key={comment.id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography className={classes.commentUser}>
                      {comment.user.username}
                    </Typography>
                  }
                  secondary={
                    <Typography className={classes.commentText}>
                      {comment.comment}
                    </Typography>
                  }
                  onClick={() => console.log('hi')}
                />
              </ListItem>
              <Divider component="li" />
            </div>
          ))}
          {commentCount < comments.length && (
            <Box
              className={classes.commentListFooter}
              onClick={loadMoreComments}
            >
              <span>See more comments</span>
            </Box>
          )}
          {commentCount >= comments.length &&
            commentCount > initialCommentCount && (
              <Box className={classes.commentListFooter}>
                <span onClick={resetComments}>Hide comments</span>
              </Box>
            )}
        </List>
      )}
    </>
  );
};

export default RideComments;
