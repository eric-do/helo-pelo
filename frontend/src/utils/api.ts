import { BACKEND_URL } from '../config';
import axios from 'axios';

export const debounce = <T extends Function>(cb: T, wait = 250) => {
  let h: number = 0;
  let callable = (...args: any) => {
      clearTimeout(h);
      h = setTimeout(() => cb(...args), wait) as unknown as number;
  };
  return <T>(<any>callable);
}

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

export const getTags = async (query: string = '') => {
  const { data } = await axios.get(`${BACKEND_URL}/tags/`, { params: { query } });
  return data;
}

