import React, { useState, useEffect } from 'react';
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
  Divider,
} from '@material-ui/core';
import type { User, UserProfile } from '../../types';
import { getCurrentUser, getUserProfile } from '../../utils/api';
import {
  ListContainer,
  SiteCardContainer,
  SiteCard,
  SiteCardHeader,
  CardTitle,
  CardContentPrimary,
} from '../../.shared/styles';

// Get user model from /users/me
// Get user follows
// Get user rides
// Use user id to request profile info
// Render user info in UserInfo and ProfilePicture
// Render follows with Friends
// Render user rides with Rides

const initProfile = {
  reddit_handle: '',
  peloton_handle: '',
  location: '',
  avatar: '',
  bio: '',
};

const Profile = () => {
  const [user, setUser] = useState<User | null>();
  const [profile, setProfile] = useState<UserProfile>(initProfile);
  // const cardList = makeCardListStyles();

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      const profile = await getUserProfile(user.id);
      setUser(user);
      setProfile(profile);
    })();
  }, []);

  return (
    <div>
      <div>MY PROFILE</div>
      <ListContainer>
        {user && (
          <SiteCardContainer>
            <SiteCard>
              <SiteCardHeader title={<CardTitle>{user.username}</CardTitle>} />
              {profile && (
                <CardContent>
                  <CardContentPrimary>
                    {profile.reddit_handle}
                  </CardContentPrimary>
                </CardContent>
              )}
            </SiteCard>
          </SiteCardContainer>
        )}
      </ListContainer>
    </div>
  );
};

export default Profile;
