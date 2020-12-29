import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './logout-button';
import userEvent from '@testing-library/user-event';
jest.mock('@auth0/auth0-react')
describe('LogoutButton', () => {
  let logoutFunction
  beforeEach(() => {
    logoutFunction = jest.fn()
  })
  it('buttin is shown an dlogout function is called when logged in', async() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      logout: logoutFunction
    })
    await act(async () => {
      render(<LogoutButton />)
      await userEvent.click(screen.getByTestId("logout-button"))
    });
    expect(screen.getByTestId("logout-button")).toContainHTML("Sign Out")
    expect(logoutFunction).toBeCalledTimes(1)
  });
  it('is not shown when the user is logged out', async() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    })
    await act(async () => {
      render(<LogoutButton />)
    });
    expect(screen.queryByTestId("logout-button")).toBeNull()
  });
});
