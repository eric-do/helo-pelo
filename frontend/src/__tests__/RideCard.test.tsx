/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RideCard from '../views/rides/RideCard';
import { getLocalStringFromTimeStamp } from '../utils';
import { getRideComments, getRideTags } from '../utils/api';
import { Ride, Tag, Comment } from '../types';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_URL } from '../config';

// jest.mock('../utils/api');

const validRide: Ride = {
  "id": 10,
  "description": "The ride from hell. Get on this and never get off.",
  "ride_id": "3863ad9c30af4635b3c2be1aea766fff",
  "difficulty_estimate": 7.7485,
  "duration": 1800,
  "fitness_discipline_display_name": "Tread Bootcamp",
  "image_url": "https://s3.amazonaws.com/peloton-ride-images/dda7988466b2257d89928788fd9711dc08ed95ba/img_1613524141_d4b7d06e1c6044b09af859abff8f21fd.png",
  "instructor_id": "1b79e462bd564b6ca5ec728f1a5c2af0",
  "title": "30 min of hell",
  "original_air_time": "2021-02-16T22:29:00",
  "scheduled_start_time": "2021-02-16T22:35:00",
}

const comments: Comment[] = [
  {
    "comment": "This is a test comment with no tags",
    "id": 44,
    "created_at": "2021-03-09T21:20:29.035720",
    "user": {
      "id": 2,
      "username": "test_user1",
      "email": "user1@mail.com",
      "is_active": true,
      "is_superuser": true
    }
  },
  {
    "comment": "This comment has #wonderful tags",
    "id": 46,
    "created_at": "2021-03-11T04:49:05.976540",
    "user": {
      "id": 3,
      "username": "test_user2",
      "email": "user2@mail.com",
      "is_active": true,
      "is_superuser": false
    }
  },
  {
    "comment": "This another comment",
    "id": 46,
    "created_at": "2021-03-11T04:49:05.976540",
    "user": {
      "id": 3,
      "username": "test_user2",
      "email": "user2@mail.com",
      "is_active": true,
      "is_superuser": false
    }
  },
]

const tags: Tag[] = [
  {
    "name": "britney",
    "tag_count": 541
  },
  {
    "name": "awesome",
    "tag_count": 234
  },
  {
    "name": "test",
    "tag_count": 67
  }
]

const server = setupServer(
  rest.get(`${BACKEND_URL}/rides/10/comments`, (req, res, ctx) => {
    return res(ctx.json(comments))
  }),

  rest.get(`${BACKEND_URL}/rides/10/tags`, (req, res, ctx) => {
    return res(ctx.json(tags))
  })
)

beforeAll(() => server.listen());
afterAll(() => server.resetHandlers());
afterAll(() => server.close());

it('should render rides with comments and tags correctly', async () => {
  const ride = render(<RideCard ride={validRide}/>);
  const localTimeStamp = getLocalStringFromTimeStamp(validRide.original_air_time);

  await waitFor(() => screen.getByText(`#britney`))

  expect(ride.getByText(validRide.title)).toBeInTheDocument();
  expect(ride.getByText(validRide.description)).toBeInTheDocument();
  expect(ride.getByText(localTimeStamp)).toBeInTheDocument();

  tags.forEach((tag, i) => {
    expect(ride.getByText(`#${tag.name}`)).toBeInTheDocument();
    expect(ride.getByText(`${tag.tag_count}`)).toBeInTheDocument();
  })

  comments.forEach((comment, i) => {
    const initialCount = 2;

    if (i < initialCount) {
      expect(ride.getByText(comment.comment)).toBeInTheDocument();
      expect(ride.getByText(comment.user.username)).toBeInTheDocument();
    } else {
      expect(ride.queryByText(comment.comment)).not.toBeInTheDocument();
    }
  })

  expect(ride.getByText('See more comments')).toBeInTheDocument();
});

it('should not display "See more coments" if there are no comments', () => {
  server.use(
    rest.get(`${BACKEND_URL}/rides/10/comments`, (req, res, ctx) => {
      return res(ctx.json(comments))
    })
  )
  const ride = render(<RideCard ride={validRide}/>);

  expect(ride.queryByText('See more comments')).not.toBeInTheDocument();
});

it('should accept input in the comment field', async () => {
  const comment =  {
      "comment": "Test comment with #hashtag",
      "id": 44,
      "created_at": "2021-03-09T21:20:29.035720",
      "user": {
        "id": 2,
        "username": "test_user1",
        "email": "user1@mail.com",
        "is_active": true,
        "is_superuser": true
      }
    };

  const ride = render(<RideCard ride={validRide}/>);
  const input = ride.getByPlaceholderText('Add tag(s)') as HTMLInputElement;

  fireEvent.change(input, { target: { value: comment.comment }});
  expect(input.value).toBe(comment.comment);
})