// __tests__/LoginPasskey.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Login from '../src/components/Login';
import { loginWithPasskey } from '../src/services/passkeyService';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
    useLocation: jest.fn(() => ({ state: null })),
  };
});

// Force the WebAuthn-supported branch and control the ceremony outcome.
jest.mock('../src/utils/webauthn', () => ({
  isWebAuthnSupported: () => true,
  describeWebAuthnError: () => 'The passkey prompt was dismissed.',
}));

jest.mock('../src/services/passkeyService', () => ({
  loginWithPasskey: jest.fn(),
  getApiErrorMessage: (err, fallback) => fallback,
}));

describe('<Login /> passkey flow', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    localStorage.clear();
  });

  it('renders the passkey button and signs in successfully', async () => {
    loginWithPasskey.mockResolvedValueOnce({ token: 'tokP', username: 'alice' });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const passkeyButton = screen.getByRole('button', { name: /sign in with a passkey/i });
    fireEvent.click(passkeyButton);

    await waitFor(() => {
      expect(loginWithPasskey).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem('token')).toBe('tokP');
      expect(localStorage.getItem('EMSusername')).toBe('alice');
    });

    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /go to dashboard/i }));
    expect(navigate).toHaveBeenCalledWith('/dashboard');
  });

  it('shows a friendly error when the passkey ceremony fails', async () => {
    const err = new Error('cancelled');
    err.name = 'NotAllowedError';
    loginWithPasskey.mockRejectedValueOnce(err);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign in with a passkey/i }));

    await waitFor(() => {
      expect(screen.getByText(/passkey prompt was dismissed/i)).toBeInTheDocument();
    });
    expect(navigate).not.toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
