// __tests__/Register.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Register from '../src/components/Register';
import { MemoryRouter } from 'react-router-dom';

// suppress act() warnings
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// mock react-router navigation
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe('<Register />', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    global.fetch = jest.fn();
  });

  it('toggles password and confirm-password visibility', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // grab both inputs by the same label text
    const [pwdInput, confirmInput] = screen.getAllByLabelText(/password/i, {
      selector: 'input',
    });

    // both start hidden
    expect(pwdInput).toHaveAttribute('type', 'password');
    expect(confirmInput).toHaveAttribute('type', 'password');

    // toggle the first visibility button
    fireEvent.click(screen.getByLabelText(/toggle password visibility/i));
    expect(pwdInput).toHaveAttribute('type', 'text');

    // toggle back
    fireEvent.click(screen.getByLabelText(/toggle password visibility/i));
    expect(pwdInput).toHaveAttribute('type', 'password');

    // toggle confirm-password visibility
    fireEvent.click(screen.getByLabelText(/toggle confirm password visibility/i));
    expect(confirmInput).toHaveAttribute('type', 'text');

    // and back
    fireEvent.click(screen.getByLabelText(/toggle confirm password visibility/i));
    expect(confirmInput).toHaveAttribute('type', 'password');
  });

  it('shows client-side error if passwords do not match', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // fill username
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'u1' },
    });

    // fill mismatched passwords
    const [pwdInput, confirmInput] = screen.getAllByLabelText(/password/i, {
      selector: 'input',
    });
    fireEvent.change(pwdInput, { target: { value: 'pass1' } });
    fireEvent.change(confirmInput, {
      target: { value: 'pass2' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('registers successfully and navigates to /login', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    global.fetch.mockResolvedValueOnce({ ok: true });

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'newuser' },
    });
    const [pwdInput, confirmInput] = screen.getAllByLabelText(/password/i, { selector: 'input' });
    fireEvent.change(pwdInput, { target: { value: 'secret' } });
    fireEvent.change(confirmInput, {
      target: { value: 'secret' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText(/Your account is ready/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    fireEvent.click(screen.getByRole('button', { name: /go to login/i }));
    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('shows server-side error message on failed registration', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'username taken' }),
    });

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'exists' },
    });
    const [pwdInput, confirmInput] = screen.getAllByLabelText(/password/i, { selector: 'input' });
    fireEvent.change(pwdInput, { target: { value: 'p' } });
    fireEvent.change(confirmInput, { target: { value: 'p' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/username taken/i)).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });
});
