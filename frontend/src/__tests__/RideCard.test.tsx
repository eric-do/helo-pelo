import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RideCard from '../views/rides/RideCard';
// import { rideWithCommentsAndTags } from './data';
import { getLocalStringFromTimeStamp } from '../utils/datetime'
import { Ride } from '../types';

const rideWithCommentsAndTags: Ride = {
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
  "comments": [
      {
          "comment": "First test comment",
          "created_at": "2021-03-04T02:31:48.093456",
          "user_id": 1
      },
      {
          "comment": "Second test comment",
          "created_at": "2021-03-05T02:33:56.471972",
          "user_id": 2
      },
      {
        "comment": "Third test comment",
        "created_at": "2021-03-06T02:33:56.471972",
        "user_id": 3
    },
  ],
  "tags": [
      {
          "tag_id": 25,
          "ride_id": 11,
          "tag_count": 3,
          "tag": {
              "name": "wow"
          }
      },
      {
          "tag_id": 26,
          "ride_id": 11,
          "tag_count": 3,
          "tag": {
              "name": "awesome"
          }
      },
      {
          "tag_id": 27,
          "ride_id": 11,
          "tag_count": 3,
          "tag": {
              "name": "spicy"
          }
      },
      {
          "tag_id": 28,
          "ride_id": 11,
          "tag_count": 1,
          "tag": {
              "name": "newbie"
          }
      }
  ]
}

const rideWithNoCommentsAndTags: Ride = {
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
  "comments": [],
  "tags": []
}

it('Renders rides with comments and tags correctly', () => {
  const ride = render(<RideCard ride={rideWithCommentsAndTags}/>);
  const localTimeStamp = getLocalStringFromTimeStamp(rideWithCommentsAndTags.original_air_time);

  expect(ride.getByText(rideWithCommentsAndTags.title)).toBeInTheDocument();
  expect(ride.getByText(rideWithCommentsAndTags.description)).toBeInTheDocument();
  expect(ride.getByText(localTimeStamp)).toBeInTheDocument();

  rideWithCommentsAndTags.tags.forEach((tag, i) => {
    const initialCount = 2;

    expect(ride.getByText(`#${tag.tag.name}`)).toBeInTheDocument();
  })

  rideWithCommentsAndTags.comments.forEach((comment, i) => {
    const initialCount = 2;

    if (i < 2) {
      expect(ride.getByText(comment.comment)).toBeInTheDocument();
    } else {
      expect(ride.queryByText(comment.comment)).not.toBeInTheDocument();
    }
  })

  expect(ride.getByText('See more comments')).toBeInTheDocument();
});

it('Does not display "See more rides" if there are no rides', () => {
  const ride = render(<RideCard ride={rideWithNoCommentsAndTags}/>);

  expect(ride.queryByText('See more comments')).not.toBeInTheDocument();
});
