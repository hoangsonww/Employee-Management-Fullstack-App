import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../src/services/authService', () => ({
  getToken: () => null,
  getUsername: () => '',
  isAuthenticated: () => false,
  setSession: jest.fn(),
  clearSession: jest.fn(),
  subscribeAuth: () => () => {},
}));

jest.mock('../../src/services/passkeyService', () => ({
  loginWithPasskey: jest.fn(),
  getApiErrorMessage: () => 'error',
  startPasskeyAuthentication: jest.fn(),
  finishPasskeyAuthentication: jest.fn(),
}));

import Login from '../../src/components/Login';

describe('Login snapshot', () => {
  it('matches the rendered markup', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/login']}>
        <Login />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
