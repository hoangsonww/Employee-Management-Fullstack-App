import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VerifyUsername from '../../src/components/VerifyUsername';

describe('VerifyUsername snapshot', () => {
  it('matches the rendered markup', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/verify-username']}>
        <VerifyUsername />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
