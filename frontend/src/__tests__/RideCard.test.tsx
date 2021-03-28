/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { server, comments, tags, ride as validRide } from './__mocks__';
import RideCard from '../views/rides/RideCard';
import { getLocalStringFromTimeStamp } from '../utils';
import { Ride, Tag, Comment } from '../types';
import { BACKEND_URL } from '../config';

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

it('should render rides with comments and tags correctly', async () => {
  const ride = render(<RideCard ride={validRide} />);
  const localTimeStamp = getLocalStringFromTimeStamp(
    validRide.original_air_time
  );

  await waitFor(() => screen.getByText(`#${tags[0].name}`));

  expect(ride.getByText(validRide.title)).toBeInTheDocument();
  expect(ride.getByText(validRide.description)).toBeInTheDocument();
  expect(ride.getByText(localTimeStamp)).toBeInTheDocument();

  tags.forEach((tag, i) => {
    expect(ride.getByText(`#${tag.name}`)).toBeInTheDocument();
    expect(ride.getByText(`${tag.tag_count}`)).toBeInTheDocument();
  });

  comments.forEach((comment, i) => {
    const initialCount = 2;

    if (i < initialCount) {
      expect(ride.getByText(comment.comment)).toBeInTheDocument();
      expect(ride.getByText(comment.user.username)).toBeInTheDocument();
    } else {
      expect(ride.queryByText(comment.comment)).not.toBeInTheDocument();
    }
  });

  expect(ride.getByText('See more comments')).toBeInTheDocument();
});

it('should not display "See more comments" if there are no comments', () => {
  server.use(
    rest.get(`${BACKEND_URL}/rides/10/comments`, (req, res, ctx) => {
      return res(ctx.json(comments));
    })
  );
  const ride = render(<RideCard ride={validRide} />);

  expect(ride.queryByText('See more comments')).not.toBeInTheDocument();
});

it('should accept input in the comment field', async () => {
  const comment = {
    comment: 'Test comment with #hashtag',
    id: 44,
    created_at: '2021-03-09T21:20:29.035720',
    user: {
      id: 2,
      username: 'test_user1',
      email: 'user1@mail.com',
      is_active: true,
      is_superuser: true,
    },
  };

  const ride = render(<RideCard ride={validRide} />);
  const input = ride.getByPlaceholderText('Add tag(s)') as HTMLInputElement;

  fireEvent.change(input, { target: { value: comment.comment } });
  expect(input.value).toBe(comment.comment);
});

xit('should update comments after submitting a comment', async () => {
  const comment = {
    comment: 'newly added comment',
    id: 44,
    created_at: '2021-03-09T21:20:29.035720',
    user: {
      id: 2,
      username: 'test_user1',
      email: 'user1@mail.com',
      is_active: true,
      is_superuser: true,
    },
  };

  const ride = render(<RideCard ride={validRide} />);
  const input = ride.getByPlaceholderText('Add tag(s)') as HTMLInputElement;

  server.use(
    rest.get(`${BACKEND_URL}/rides/10/comments`, (req, res, ctx) => {
      return res.once(ctx.json([comment]));
    })
  );

  fireEvent.change(input, { target: { value: comment.comment } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

  await waitFor(() =>
    expect(screen.getByText(/newly added comment/)).toBeInTheDocument()
  );
  expect(screen.getByText(/newly added comment/)).toBeInTheDocument();

  await waitFor(() => expect(input.value).toBe(''));
  expect(input.value).toBe('');
});
