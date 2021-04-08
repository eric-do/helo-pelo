/**
 * @jest-environment jsdom
 */
import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { server, rides, tags } from './__mocks__';
import { RideOptionsProvider } from '../providers/RidesProvider';
import RideList from '../views/rides/RideList';
import { BACKEND_URL } from '../config';

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('<RideList />', () => {
  it('should render list of rides', async () => {
    const rideList = render(<RideList />);
    await waitFor(() =>
      expect(rideList.getByText(rides[0].title)).toBeInTheDocument()
    );
    rides.forEach((ride) => {
      expect(rideList.getByText(ride.title)).toBeInTheDocument();
    });
  });

  it('should render a spinner while rides are loading', async () => {
    const rideList = render(<RideList />);
    expect(rideList.getByRole('progressbar')).toBeInTheDocument();
    await waitForElementToBeRemoved(() => rideList.getByRole('progressbar'));
    expect(rideList.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should render an error message if request fails', async () => {
    const error = { detail: 'Network request failed' };

    server.use(
      rest.get(`${BACKEND_URL}/rides/`, (req, res, ctx) => {
        return res.once(ctx.status(400), ctx.json(error));
      })
    );

    const rideList = render(<RideList />);
    await waitFor(() =>
      expect(rideList.getByText(error.detail)).toBeInTheDocument()
    );
  });

  xit('should render error modal if request fails due to auth', async () => {
    // Get valid rides list
    // Attempt comment submission to a ride and get a 401
    // Confirm modal displays
    const rideList = render(<RideList />);
    const status = 401;
    const error = { detail: 'Authentication failed' };

    server.use(
      rest.post(`${BACKEND_URL}/rides/:rideId/comments`, (req, res, ctx) => {
        return res.once(ctx.status(status), ctx.json(error));
      })
    );

    await waitFor(() =>
      expect(rideList.getByText(rides[0].title)).toBeInTheDocument()
    );

    const input = rideList.getByPlaceholderText(
      'Add tag(s)'
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'test comment' } });
    fireEvent.submit(input);

    await waitFor(() =>
      expect(screen.getByText('You have been logged out')).toBeInTheDocument()
    );
  });

  it('should re-render when user clicks a card tag', async () => {
    // Render list of rides
    // Mock click on tag
    // Await rerender
    // Confirm length of rides
    const rideList = render(
      <RideOptionsProvider>
        <RideList />
      </RideOptionsProvider>
    );
    const tagDisplay = `#${tags[0].name}`;

    await waitFor(() =>
      expect(rideList.getByText(tagDisplay)).toBeInTheDocument()
    );

    server.use(
      rest.get(`${BACKEND_URL}/rides/`, (req, res, ctx) => {
        return res.once(ctx.json([rides[0]]));
      })
    );

    const buttons = rideList.getAllByRole('button', {
      name: tagDisplay,
    });

    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(rideList.queryByText(rides[1].title)).not.toBeInTheDocument();
    });

    expect(rideList.queryByText(rides[1].title)).not.toBeInTheDocument();
  });
});
