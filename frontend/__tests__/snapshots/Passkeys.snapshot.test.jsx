import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Keep the passkey list pending so the page renders its deterministic loading
// state with no network/WebAuthn dependency.
jest.mock('../../src/services/passkeyService', () => ({
  getPasskeys: () => new Promise(() => {}),
  registerNewPasskey: jest.fn(),
  renamePasskey: jest.fn(),
  deletePasskey: jest.fn(),
  loginWithPasskey: jest.fn(),
  getApiErrorMessage: () => 'error',
  startPasskeyRegistration: jest.fn(),
  finishPasskeyRegistration: jest.fn(),
  startPasskeyAuthentication: jest.fn(),
  finishPasskeyAuthentication: jest.fn(),
}));

import Passkeys from '../../src/components/Passkeys';

describe('Passkeys snapshot', () => {
  it('matches the rendered markup', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/passkeys']}>
        <Passkeys />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
