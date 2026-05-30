// __tests__/RegisterPasskey.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Register from '../src/components/Register';
import { isWebAuthnSupported } from '../src/utils/webauthn';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

jest.mock('../src/utils/webauthn', () => ({
  isWebAuthnSupported: jest.fn(),
  describeWebAuthnError: () => 'webauthn error',
  suggestPasskeyName: () => 'Test Device',
}));

// PasskeyPromptDialog (rendered by Register) imports these.
jest.mock('../src/services/passkeyService', () => ({
  registerNewPasskey: jest.fn(),
  getApiErrorMessage: (err, fallback) => fallback,
}));

const fillAndSubmit = () => {
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'newuser' } });
  const [pwd, confirm] = screen.getAllByLabelText(/password/i, { selector: 'input' });
  fireEvent.change(pwd, { target: { value: 'secret' } });
  fireEvent.change(confirm, { target: { value: 'secret' } });
  fireEvent.click(screen.getByRole('button', { name: /^register$/i }));
};

describe('<Register /> auto-login + passkey prompt', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    localStorage.clear();
    global.fetch = jest.fn();
  });

  it('auto-logs in and navigates to dashboard when passkeys are unsupported', async () => {
    isWebAuthnSupported.mockReturnValue(false);
    global.fetch
      .mockResolvedValueOnce({ ok: true }) // /register
      .mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'tokR', username: 'newuser' }) }); // /authenticate

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fillAndSubmit();

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('tokR');
      expect(navigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('auto-logs in and shows the passkey prompt when passkeys are supported', async () => {
    isWebAuthnSupported.mockReturnValue(true);
    global.fetch.mockResolvedValueOnce({ ok: true }).mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'tokR2', username: 'newuser' }) });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText(/set up a passkey/i)).toBeInTheDocument();
    });
    expect(localStorage.getItem('token')).toBe('tokR2');

    fireEvent.click(screen.getByRole('button', { name: /maybe later/i }));
    expect(navigate).toHaveBeenCalledWith('/dashboard');
  });

  it('falls back to the "go to login" dialog when auto-login fails', async () => {
    isWebAuthnSupported.mockReturnValue(true);
    global.fetch
      .mockResolvedValueOnce({ ok: true }) // /register ok
      .mockResolvedValueOnce({ ok: false }); // /authenticate fails

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText(/your account is ready/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /go to login/i }));
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});
