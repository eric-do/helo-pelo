import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { server, user, userProfile } from './__mocks__';
import Profile from '../views/Profile';

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
