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

import Navbar from '../../src/components/Navbar';

describe('Navbar snapshot', () => {
  it('matches the rendered markup (signed out)', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
