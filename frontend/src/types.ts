export type Comment = {
  comment: string,
  created_at: string,
  user_id: number
}

export type Tag = {
  tag_id: number,
  ride_id: number,
  tag_count: number,
  tag: {
    name: string
  }
}

export type Ride = {
  id: number,
  description: string,
  ride_id: string,
  difficulty_estimate: number,
  duration: number,
  fitness_discipline_display_name: string,
  image_url: string,
  instructor_id: string,
  title: string
  original_air_time: string
  scheduled_start_time: string
  comments: Comment[],
  tags: Tag[]
};