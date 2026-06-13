import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import QuickActions from '../../src/components/QuickActions';

describe('QuickActions snapshot', () => {
  it('matches the rendered markup', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <QuickActions />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
