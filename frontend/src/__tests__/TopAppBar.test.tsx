/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TopAppBar from '../navigation/TopAppBar';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_URL } from '../config';

const toggleDrawer = (open: boolean) => (
  event: React.KeyboardEvent | React.MouseEvent
) => {};

it('should render the search field', async () => {
  const appBar = render(<TopAppBar isOpen={true} toggleDrawer={toggleDrawer}/>)

  expect(appBar.getByPlaceholderText('Search...')).toBeInTheDocument();
});

it('should accept input in the search field', async () => {
  const appBar = render(<TopAppBar isOpen={true} toggleDrawer={toggleDrawer}/>)
  const input = appBar.getByPlaceholderText('Search...') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'Test search query' }});
  expect(input.value).toBe('Test search query');
})