/**
 * @jest-environment jsdom
 */
import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
} from '@testing-library/react';
import { within } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import TopAppBar from '../navigation/TopAppBar';
import { BACKEND_URL } from '../config';
import type { Tag, Ride, Comment } from '../types';

const tags: Tag[] = [
  {
    name: 'test',
    tag_count: 435,
  },
  {
    name: 'tenOutOfTen',
    tag_count: 234,
  },
  {
    name: 'DoesNotStartWithTe',
    tag_count: 543,
  },
];

const comments: Comment[] = [
  {
    comment: 'This is a test comment with no tags',
    id: 44,
    created_at: '2021-03-09T21:20:29.035720',
    user: {
      id: 2,
      username: 'test_user1',
      email: 'user1@mail.com',
      is_active: true,
      is_superuser: true,
    },
  },
  {
    comment: 'This comment has #wonderful tags',
    id: 46,
    created_at: '2021-03-11T04:49:05.976540',
    user: {
      id: 3,
      username: 'test_user2',
      email: 'user2@mail.com',
      is_active: true,
      is_superuser: false,
    },
  },
  {
    comment: 'This another comment',
    id: 46,
    created_at: '2021-03-11T04:49:05.976540',
    user: {
      id: 3,
      username: 'test_user2',
      email: 'user2@mail.com',
      is_active: true,
      is_superuser: false,
    },
  },
];

const rides: Ride[] = [
  {
    id: 10,
    description: 'The ride from hell. Get on this and never get off.',
    ride_id: '3863ad9c30af4635b3c2be1aea766fff',
    difficulty_estimate: 7.7485,
    duration: 1800,
    fitness_discipline_display_name: 'Tread Bootcamp',
    image_url:
      'https://s3.amazonaws.com/peloton-ride-images/dda7988466b2257d89928788fd9711dc08ed95ba/img_1613524141_d4b7d06e1c6044b09af859abff8f21fd.png',
    instructor_id: '1b79e462bd564b6ca5ec728f1a5c2af0',
    title: '30 min of hell',
    original_air_time: '2021-02-16T22:29:00',
    scheduled_start_time: '2021-02-16T22:35:00',
  },
];

const server = setupServer(
  rest.get(`${BACKEND_URL}/tags/`, (req, res, ctx) => {
    return res(ctx.json(tags));
  }),

  rest.get(`${BACKEND_URL}/rides/`, (req, res, ctx) => {
    return res(ctx.json(rides));
  }),

  rest.get(`${BACKEND_URL}/rides/10`, (req, res, ctx) => {
    return res(ctx.json(rides[0]));
  }),

  rest.get(`${BACKEND_URL}/rides/10/comments`, (req, res, ctx) => {
    return res(ctx.json(comments));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.resetHandlers());
afterAll(() => server.close());

const toggleDrawer = (open: boolean) => (
  event: React.KeyboardEvent | React.MouseEvent
) => {};

it('should render the search field', async () => {
  const appBar = render(<TopAppBar isOpen toggleDrawer={toggleDrawer} />);

  expect(appBar.getByLabelText('Tag search')).toBeInTheDocument();
});

xit('should dropdown when user clicks search field', async () => {
  const appBar = render(<TopAppBar isOpen toggleDrawer={toggleDrawer} />);
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;

  fireEvent.click(input);
  expect(screen.getByRole('presentation')).toBeInTheDocument();
  expect(screen.getByText(/Loading/)).toBeInTheDocument();
});

it('should accept input in the search field', async () => {
  const appBar = render(<TopAppBar isOpen toggleDrawer={toggleDrawer} />);
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'te' } });
  expect(input.value).toBe('te');
});

it('should dynamically render matched tags as user types', async () => {
  const appBar = render(<TopAppBar isOpen toggleDrawer={toggleDrawer} />);
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;
  const search = 'te';

  fireEvent.change(input, { target: { value: search } });
  expect(input.value).toBe(search);

  await waitFor(() => screen.getAllByText(`rides`, { exact: false }));

  tags.forEach((tag) => {
    expect(appBar.getByText(tag.name)).toBeInTheDocument();
    expect(appBar.getByText(`${tag.tag_count} rides`)).toBeInTheDocument();
  });
});

it('should not allow users to enter separate words in the search', async () => {
  const appBar = render(<TopAppBar isOpen toggleDrawer={toggleDrawer} />);
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'test string' } });
  expect(input.value).toBe('teststring');
});

it('should not allow users to enter separate words in the search', async () => {
  const appBar = render(<TopAppBar isOpen toggleDrawer={toggleDrawer} />);
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'test string' } });
  expect(input.value).toBe('teststring');
});

it('should display "No tags found" if no tags are found', async () => {
  const appBar = render(<TopAppBar isOpen toggleDrawer={toggleDrawer} />);
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'nomatchinghashtags' } });

  await waitFor(() => screen.getByText(/No tags found/));
  expect(screen.getByText(/No tags found/)).toBeInTheDocument();
});
