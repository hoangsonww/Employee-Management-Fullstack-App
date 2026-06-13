import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// The hero is a react-three-fiber/WebGL scene that can't run in jsdom and is
// nondeterministic; stub it so the LandingPage snapshot is stable.
jest.mock('../../src/components/hero3d/HeroBackground', () => () => (
  <div data-testid="hero-background-mock" />
));

import LandingPage from '../../src/components/LandingPage';

describe('LandingPage snapshot', () => {
  it('matches the rendered markup', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/']}>
        <LandingPage />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
