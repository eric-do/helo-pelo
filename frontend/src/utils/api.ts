import axios from 'axios';
import { BACKEND_URL } from '../config';
import type { Ride, RideOptions } from '../types';

export const debounce = <T extends Function>(cb: T, wait = 250) => {
  let h: number = 0;
  const callable = (...args: any) => {
    clearTimeout(h);
    h = (setTimeout(() => cb(...args), wait) as unknown) as number;
  };
  return <T>(<any>callable);
};

export const getMessage = async () => {
  const response = await fetch(BACKEND_URL);

  const data = await response.json();

  if (data.message) {
    return data.message;
  }

  return Promise.reject(new Error('Failed to get message from backend'));
};

export const getRides = async (options: RideOptions = {}) => {
  const url = new URL(`${BACKEND_URL}/rides/`);

  const params: RideOptions = options;
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  const response = await fetch(url.toString());
  const rides = await response.json();
  return rides;
};

export const getRideComments = async (rideId: number) => {
  const response = await fetch(`${BACKEND_URL}/rides/${rideId}/comments`);
  const comments = await response.json();
  return comments;
};

export const getRideTags = async (rideId: number) => {
  const response = await fetch(`${BACKEND_URL}/rides/${rideId}/tags`);
  const tags = await response.json();
  return tags;
};

export const getRide = async (rideId: number) => {
  const response = await fetch(`${BACKEND_URL}/rides/${rideId}`);
  const ride = await response.json();
  return ride;
};

export const addComment = async (rideId: number, comment: string) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const data = { comment };
  await axios.post(`${BACKEND_URL}/rides/${rideId}/comments`, data, config);
};

export const getTags = async (query: string = '') => {
  const { data } = await axios.get(`${BACKEND_URL}/tags/`, {
    params: { query },
  });
  return data;
};
