import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RideCard from '../views/rides/RideCard';
// import { rideWithCommentsAndTags } from './data';
import { getLocalStringFromTimeStamp } from '../utils/datetime'
import { Ride } from '../types';

const rideWithCommentsAndTags: Ride = {
  "description": "Combine your cardio and strength training in one efficient and effective package! Push yourself by alternating between intervals-based running segments on the Tread and strength training on the floor.",
  "ride_id": "3863ad9c30af4635b3c2be1aea766fff",
  "difficulty_estimate": 7.7485,
  "duration": 1800,
  "fitness_discipline_display_name": "Tread Bootcamp",
  "image_url": "https://s3.amazonaws.com/peloton-ride-images/dda7988466b2257d89928788fd9711dc08ed95ba/img_1613524141_d4b7d06e1c6044b09af859abff8f21fd.png",
  "instructor_id": "1b79e462bd564b6ca5ec728f1a5c2af0",
  "title": "30 min Bootcamp: Bodyweight",
  "original_air_time": "2021-02-16T22:29:00",
  "scheduled_start_time": "2021-02-16T22:35:00",
  "comments": [
      {
          "comment": "test comment for ride 11",
          "created_at": "2021-03-04T02:31:48.093456",
          "user_id": 2
      },
      {
          "comment": "another test comment for ride 11",
          "created_at": "2021-03-05T02:33:56.471972",
          "user_id": 2
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

it('Ride Card renders correctly', () => {
  const ride = render(<RideCard ride={rideWithCommentsAndTags}/>);
  const localTimeStamp = getLocalStringFromTimeStamp(rideWithCommentsAndTags.original_air_time);

  expect(ride.getByText(rideWithCommentsAndTags.title)).toBeInTheDocument();
  expect(ride.getByText(rideWithCommentsAndTags.description)).toBeInTheDocument();
  expect(ride.getByText(localTimeStamp)).toBeInTheDocument();

  rideWithCommentsAndTags.tags.forEach(tag => {
    expect(ride.getByText(tag.tag.name)).toBeInTheDocument();
  })
});
