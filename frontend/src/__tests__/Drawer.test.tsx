import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { server, LargeWrapper, tags } from './__mocks__';
import Drawer from '../navigation/Drawer';

const siteNavigation = ['Profile', 'RideFeed'];

beforeAll(() => server.listen());
afterAll(() => server.resetHandlers());
afterAll(() => server.close());

const toggleDrawer = (open: boolean) => (
  event: React.KeyboardEvent | React.MouseEvent
) => {};

describe('<Drawer />', () => {
  it('should render site navigation links', () => {
    const drawer = render(
      <Router>
        <Drawer open toggleDrawer={toggleDrawer} />
      </Router>,
      {
        wrapper: LargeWrapper,
      }
    );
    siteNavigation.forEach((section) => {
      expect(drawer.getByText(section)).toBeInTheDocument();
    });
  });

  it('should render Trending Tags section', () => {
    const drawer = render(
      <Router>
        <Drawer open toggleDrawer={toggleDrawer} />
      </Router>,
      {
        wrapper: LargeWrapper,
      }
    );
    expect(drawer.getByText(/Trending Tags/)).toBeInTheDocument();
  });

  it('should render tags', async () => {
    const drawer = render(
      <Router>
        <Drawer open toggleDrawer={toggleDrawer} />
      </Router>,
      {
        wrapper: LargeWrapper,
      }
    );
    await waitFor(() =>
      expect(drawer.getByText(`#${tags[0].name}`)).toBeInTheDocument()
    );
    tags.forEach((tag) => {
      const name = `#${tag.name}`;
      const count = `${tag.tag_count} ${tag.tag_count > 1 ? 'rides' : 'ride'}`;
      expect(drawer.getByText(name)).toBeInTheDocument();
      expect(drawer.getByText(count)).toBeInTheDocument();
    });
  });
});
