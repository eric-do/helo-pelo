import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { server } from './__mocks__';
import { Login } from '../views';

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

it('Login renders correctly', () => {
  const login = render(<Login />);
  expect(login.getByText('Email')).toBeInTheDocument();
  expect(login.getByText('Password')).toBeInTheDocument();
  expect(login.getByText('Login')).toBeInTheDocument();
});

xit('Successfully logs user in using Enter', async () => {
  const login = render(<Login />);
  const emailInput = login.getByLabelText(/Email/);
  const passwordInput = login.getByLabelText(/Password/);
  fireEvent.change(emailInput, { target: { value: 'test_user@mail.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password1234' } });
  fireEvent.keyDown(passwordInput, { key: 'Enter', code: 'Enter' });
  await waitFor(() => expect(screen.getByText('Success')).toBeInTheDocument());
  expect(screen.getByText('Success')).toBeInTheDocument();
});

xit('Successfully logs user in using mouse click', async () => {
  const login = render(<Login />);
  const emailInput = login.getByLabelText(/Email/);
  const passwordInput = login.getByLabelText(/Password/);
  const loginButton = login.getByText(/Login/);
  fireEvent.change(emailInput, { target: { value: 'test_user@mail.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password1234' } });
  fireEvent.click(loginButton);
  await waitFor(() => expect(screen.getByText('Success')).toBeInTheDocument());
  expect(screen.getByText('Success')).toBeInTheDocument();
});
