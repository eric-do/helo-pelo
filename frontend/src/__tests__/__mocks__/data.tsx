import type { User, UserProfile, Ride, Comment, Tag } from '../../types';

export const tags: Tag[] = [
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
    tag_count: 1,
  },
];

export const user: User = {
  id: 1,
  username: 'test_user',
  email: 'test@mail.com',
  is_active: true,
  is_superuser: false,
};

export const userProfile: UserProfile = {
  reddit_handle: 'test_reddit_handle',
  peloton_handle: 'test_peloton_handle',
  location: 'California',
  avatar: 'http://test.com/image.png',
  bio: 'This is a test bio for test user.',
};

export const ride: Ride = {
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
};

export const rides: Ride[] = [
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

export const comments: Comment[] = [
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
