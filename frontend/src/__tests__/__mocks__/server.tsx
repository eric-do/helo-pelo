import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { BACKEND_URL } from '../../config';
import { user, userProfile, rides, comments, tags } from './data';

export const server = setupServer(
  rest.get(`${BACKEND_URL}/users/me`, (req, res, ctx) => {
    return res(ctx.json(user));
  }),

  rest.get(`${BACKEND_URL}/users/1/profile`, (req, res, ctx) => {
    return res(ctx.json(userProfile));
  }),

  rest.get(`${BACKEND_URL}/rides/10/comments`, (req, res, ctx) => {
    return res(ctx.json(comments));
  }),

  rest.get(`${BACKEND_URL}/rides/10/tags`, (req, res, ctx) => {
    return res(ctx.json(tags));
  }),

  rest.get(`${BACKEND_URL}/tags/`, (req, res, ctx) => {
    return res(ctx.json(tags));
  }),

  rest.get(`${BACKEND_URL}/rides/`, (req, res, ctx) => {
    return res(ctx.json(rides));
  }),

  rest.get(`${BACKEND_URL}/rides/10`, (req, res, ctx) => {
    return res(ctx.json(rides[0]));
  })
);
