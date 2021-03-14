import { BACKEND_URL } from '../config';
import axios from 'axios';

export const getMessage = async () => {
  const response = await fetch(BACKEND_URL);

  const data = await response.json();

  if (data.message) {
    return data.message;
  }

  return Promise.reject('Failed to get message from backend');
};

export const getRides = async () => {
  const response = await fetch(`${BACKEND_URL}/rides/`);
  const rides = await response.json();
  return rides;
}

export const getRideComments = async(ride_id: number) => {
  const response = await fetch(`${BACKEND_URL}/rides/${ride_id}/comments`)
  const comments = await response.json()
  return comments
}

export const getRideTags = async(ride_id: number) => {
  const response = await fetch(`${BACKEND_URL}/rides/${ride_id}/tags`)
  const tags = await response.json()
  return tags
}

export const getRide = async (ride_id: number) => {
  const response = await fetch(`${BACKEND_URL}/rides/${ride_id}`);
  const ride = await response.json();
  return ride;
}

export const addComment = async (ride_id: number, comment: string) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const data = { comment };

  await axios.post(
    `${BACKEND_URL}/rides/${ride_id}/comments`,
    data,
    config
  )
}

