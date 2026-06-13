import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetPassword from '../../src/components/ResetPassword';

describe('ResetPassword snapshot', () => {
  it('matches the rendered markup', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/reset-password']}>
        <ResetPassword />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
