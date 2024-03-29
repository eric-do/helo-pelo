import axios from 'axios';
import { BACKEND_URL } from '../config';
import type { Ride, RideOptions } from '../types';

class RequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const debounce = <T extends Function>(cb: T, wait = 250) => {
  let h: number = 0;
  const callable = (...args: any) => {
    clearTimeout(h);
    h = (setTimeout(() => cb(...args), wait) as unknown) as number;
  };
  return <T>(<any>callable);
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/users/me`, config);
  const user = response.json();
  return user;
};

export const getUserProfile = async (userId: number) => {
  const response = await fetch(`${BACKEND_URL}/users/${userId}/profile`);
  const profile = response.json();
  return profile;
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

  if (response.status === 500) {
    throw new Error('Internal server error');
  }

  const data = await response.json();

  if (response.status >= 400 && response.status < 500) {
    throw data.detail || data;
  }

  return data;
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
  type PostResponse = {
    detail: string;
  };

  const token = localStorage.getItem('token');
  const data = { comment };

  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${BACKEND_URL}/rides/${rideId}/comments`,
    config
  );

  if (!response.ok) {
    throw new RequestError(response.statusText, response.status);
  }

  return response;
};

export const getTags = async (query: string = '') => {
  const { data } = await axios.get(`${BACKEND_URL}/tags/`, {
    params: { query },
  });
  return data;
};
