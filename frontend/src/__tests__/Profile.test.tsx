import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Ride, Tag, Comment } from '../types';
import { BACKEND_URL } from '../config';
import Profile from '../views/Profile';
import type { User, UserProfile } from '../types';

const user: User = {
  id: 1,
  username: 'test_user',
  email: 'test@mail.com',
  is_active: true,
  is_superuser: false,
};

const userProfile: UserProfile = {
  reddit_handle: 'test_reddit_handle',
  peloton_handle: 'test_peloton_handle',
  location: 'California',
  avatar: 'http://test.com/image.png',
  bio: 'This is a test bio for test user.',
};

const server = setupServer(
  rest.get(`${BACKEND_URL}/users/me`, (req, res, ctx) => {
    return res(ctx.json(user));
  }),

  rest.get(`${BACKEND_URL}/users/1/profile`, (req, res, ctx) => {
    return res(ctx.json(userProfile));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.resetHandlers());
afterAll(() => server.close());

it('should render Profile page', async () => {
  const profile = render(<Profile />);
  expect(profile.getByText(/my profile/i)).toBeInTheDocument();
  await waitFor(() => {
    expect(profile.getByText(user.username)).toBeInTheDocument();
  });
  expect(profile.getByText(user.username)).toBeInTheDocument();
  expect(profile.getByText(userProfile.reddit_handle)).toBeInTheDocument();
});
