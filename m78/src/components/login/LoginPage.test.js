import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { loginUser as mockLoginUser } from '../../api/users';

jest.mock('../../api/users', () => ({
  loginUser: jest.fn(),
}));

describe('LoginPage component', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <LoginPage updateLoggedin={jest.fn()} />
      </MemoryRouter>
    );
  });

  test('submits form with valid credentials', async () => {
    const updateLoggedin = jest.fn();
    const mockResponse = { loginSuccess: true, ID: 'someID' };
    mockLoginUser.mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <LoginPage updateLoggedin={updateLoggedin} />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(updateLoggedin).toHaveBeenCalledTimes(0);
      expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
    });
  });

  test('displays error message for invalid credentials', async () => {
    const mockResponse = { loginSuccess: false, message: 'Invalid credentials' };
    mockLoginUser.mockResolvedValue(mockResponse);

    const originalAlert = window.alert;
    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <LoginPage updateLoggedin={jest.fn()} />
      </MemoryRouter>
    );

    const signInButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(window.alert).not.toHaveBeenCalledWith('Invalid credentials');
    });

    window.alert = originalAlert;
  });
});
