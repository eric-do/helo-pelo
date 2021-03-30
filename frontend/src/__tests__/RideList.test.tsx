/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { server, rides } from './__mocks__';
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

  it('should render a spinner while rides are loading', async () => {});

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
});
