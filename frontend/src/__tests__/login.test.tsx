import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter, Route } from 'react-router-dom';
import { rest } from 'msw';
import { server } from './__mocks__';
import { Login } from '../views';

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('<Login />', () => {
  it('Login renders correctly', () => {
    const login = render(<Login />);
    expect(login.getByText('Email')).toBeInTheDocument();
    expect(login.getByText('Password')).toBeInTheDocument();
    expect(login.getByText('Login')).toBeInTheDocument();
  });

  it('displays error message if login unsuccessful', async () => {
    const login = render(<Login />);
    const emailInput = login.getByLabelText(/Email/);
    const passwordInput = login.getByLabelText(/Password/);
    const loginButton = login.getByText(/Login/);

    server.use(
      rest.post(`/api/token`, (req, res, ctx) => {
        return res.once(
          ctx.status(401),
          ctx.json('Incorrect username or password')
        );
      })
    );

    fireEvent.change(emailInput, { target: { value: 'test_user@mail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password1234' } });
    fireEvent.click(loginButton);
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(
      screen.getByText(/Incorrect username or password/)
    ).toBeInTheDocument();
  });

  it('Successfully logs user in using Enter', async () => {
    const login = render(
      <BrowserRouter>
        <Login />
        <Route path="/">Home</Route>
      </BrowserRouter>
    );
    const emailInput = login.getByLabelText(/Email/);
    const passwordInput = login.getByLabelText(/Password/);
    fireEvent.change(emailInput, { target: { value: 'test_user@mail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password1234' } });
    fireEvent.keyDown(passwordInput, { key: 'Enter', code: 'Enter' });
    await waitFor(() => expect(screen.getByText(/Home/)).toBeInTheDocument());
    expect(screen.getByText(/Home/)).toBeInTheDocument();
  });

  it('Successfully logs user in using mouse click', async () => {
    const login = render(
      <BrowserRouter>
        <Login />
        <Route path="/">Home</Route>
      </BrowserRouter>
    );
    const emailInput = login.getByLabelText(/Email/);
    const passwordInput = login.getByLabelText(/Password/);
    const loginButton = login.getByText(/Login/);
    fireEvent.change(emailInput, { target: { value: 'test_user@mail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password1234' } });
    fireEvent.click(loginButton);
    await waitFor(() => expect(screen.getByText(/Home/)).toBeInTheDocument());
    expect(screen.getByText(/Home/)).toBeInTheDocument();
  });
});
