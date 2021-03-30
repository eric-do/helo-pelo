export type User = {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
};

export type UserProfile = {
  reddit_handle: string;
  peloton_handle: string;
  location: string;
  avatar: string;
  bio: string;
};

export type Comment = {
  id: number;
  comment: string;
  created_at: string;
  user: User;
};

export type Tag = {
  tag_count: number;
  name: string;
};

export type Ride = {
  id: number;
  description: string;
  ride_id: string;
  difficulty_estimate: number;
  duration: number;
  fitness_discipline_display_name: string;
  image_url: string;
  instructor_id: string;
  title: string;
  original_air_time: string;
  scheduled_start_time: string;
};

export type RideOptions = {
  [key: string]: string;
};
