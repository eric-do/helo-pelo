/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { server, tags } from './__mocks__';
import TopAppBar from '../navigation/TopAppBar';

beforeAll(() => server.listen());
afterAll(() => server.resetHandlers());
afterAll(() => server.close());

const toggleDrawer = (open: boolean) => (
  event: React.KeyboardEvent | React.MouseEvent
) => {};

it('should render the search field', async () => {
  const appBar = render(
    <Router>
      <TopAppBar isOpen toggleDrawer={toggleDrawer} />
    </Router>
  );

  expect(appBar.getByLabelText('Tag search')).toBeInTheDocument();
});

xit('should dropdown when user clicks search field', async () => {
  const appBar = render(
    <Router>
      <TopAppBar isOpen toggleDrawer={toggleDrawer} />
    </Router>
  );
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;

  fireEvent.click(input);
  expect(screen.getByRole('presentation')).toBeInTheDocument();
  expect(screen.getByText(/Loading/)).toBeInTheDocument();
});

it('should accept input in the search field', async () => {
  const appBar = render(
    <Router>
      <TopAppBar isOpen toggleDrawer={toggleDrawer} />
    </Router>
  );
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'te' } });
  expect(input.value).toBe('te');
});

it('should dynamically render matched tags while typing', async () => {
  const appBar = render(
    <Router>
      <TopAppBar isOpen toggleDrawer={toggleDrawer} />
    </Router>
  );
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;
  const search = 'te';

  fireEvent.change(input, { target: { value: search } });
  expect(input.value).toBe(search);

  await waitFor(() => screen.getAllByText(`rides`, { exact: false }));

  tags.forEach((tag) => {
    expect(appBar.getByText(`#${tag.name}`)).toBeInTheDocument();
    if (tag.tag_count > 1) {
      expect(appBar.getByText(`${tag.tag_count} rides`)).toBeInTheDocument();
    } else {
      expect(appBar.getByText(`${tag.tag_count} ride`)).toBeInTheDocument();
    }
  });
});

it('should not allow users to enter separate words in the search', async () => {
  const appBar = render(
    <Router>
      <TopAppBar isOpen toggleDrawer={toggleDrawer} />
    </Router>
  );
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'test string' } });
  expect(input.value).toBe('teststring');
});

it('should not allow users to search with special characters', async () => {
  const appBar = render(
    <Router>
      <TopAppBar isOpen toggleDrawer={toggleDrawer} />
    </Router>
  );
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'test string@#)*(^#|}{' } });
  expect(input.value).toBe('teststring');
});

it('should display "No tags found" if no tags are found', async () => {
  const appBar = render(
    <Router>
      <TopAppBar isOpen toggleDrawer={toggleDrawer} />
    </Router>
  );
  const input = appBar.getByLabelText('Tag search') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'nomatchinghashtags' } });

  await waitFor(() => screen.getByText(/No tags found/));
  expect(screen.getByText(/No tags found/)).toBeInTheDocument();
});

it('should display a button to acccess user options menu', async () => {
  const appBar = render(
    <Router>
      <TopAppBar isOpen toggleDrawer={toggleDrawer} />
    </Router>
  );
  expect(appBar.getByLabelText('User menu')).toBeInTheDocument();
});

it('should display user options when button is clicked', async () => {
  const appBar = render(
    <Router>
      <TopAppBar isOpen toggleDrawer={toggleDrawer} />
    </Router>
  );
  const button = appBar.getByLabelText('User menu');
  fireEvent.click(button);
  expect(appBar.getByText('My Profile')).toBeInTheDocument();
  expect(appBar.getByText('Sign out')).toBeInTheDocument();
});

it('should log the user out when clicking Sign out', async () => {
  const appBar = render(
    <Router>
      <TopAppBar isOpen toggleDrawer={toggleDrawer} />
    </Router>
  );
  const button = appBar.getByLabelText('User menu');
  fireEvent.click(button);

  const logout = appBar.getByText('Sign out');
  fireEvent.click(logout);

  waitFor(() => expect(screen.getByText('Remember me')).toBeInTheDocument);
});
