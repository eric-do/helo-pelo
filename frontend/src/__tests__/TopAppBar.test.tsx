/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import TopAppBar from '../navigation/TopAppBar';
import { BACKEND_URL } from '../config';

const tags = [
  {
    name: 'test',
    tag_count: 435,
  },
  {
    name: 'tenOutOfTen',
    tag_count: 234,
  },
];

const server = setupServer(
  rest.get(`${BACKEND_URL}/tags/`, (req, res, ctx) => {
    return res(ctx.json(tags));
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

it('should accept input in the search field', async () => {
  const appBar = render(<TopAppBar isOpen toggleDrawer={toggleDrawer} />);
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'te' } });
  expect(input.value).toBe('te');

  await waitFor(() => screen.getByText(`test`));

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
  expect(screen.getByRole('presentation')).toBeInTheDocument();
  expect(screen.getByText(/Loading/)).toBeInTheDocument();

  await waitFor(() => screen.getByText(/No tags found/));
  expect(screen.getByText(/No tags found/)).toBeInTheDocument();
});

it('should display "No tags found" if no tags are found', async () => {
  const appBar = render(<TopAppBar isOpen toggleDrawer={toggleDrawer} />);
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'nomatchinghashtags' } });

  await waitFor(() => screen.getByText(/No tags found/));
  expect(screen.getByText(/No tags found/)).toBeInTheDocument();
});
