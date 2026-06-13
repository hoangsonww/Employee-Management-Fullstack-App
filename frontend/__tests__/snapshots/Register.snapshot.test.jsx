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

import Register from '../../src/components/Register';

describe('Register snapshot', () => {
  it('matches the rendered markup', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Register />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
