import { BACKEND_URL } from '../config';

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
  return rides
}