import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './login-button';
jest.mock('@auth0/auth0-react')
describe('LoginButton', () => {
  let loginFunction
  beforeEach(() => {
    loginFunction = jest.fn()
  })
  it('when user is not logged in they are redirected to ogin page', async() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isLoading: false,
      loginWithRedirect: loginFunction,
      isAuthenticated: false
    })
    await act(async () => {
      render(<LoginButton />)
    });
    expect(loginFunction).toBeCalledTimes(1)
  });
  it('when user is logged in no redirection happens to login page', async() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false
    })
    await act(async () => {
      render(<LoginButton />)
    });
    expect(loginFunction).not.toHaveBeenCalled()
  });
});
