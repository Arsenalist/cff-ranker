import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './profile';
import { act } from 'react-dom/test-utils';
import { useAuth0 } from '@auth0/auth0-react';
jest.mock('@auth0/auth0-react')
describe('Profile', () => {
  it('should contain picture and name when logged in', async() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {name: 'Bill', picture: 'mypicture'}
    })
    await act(async () => {
      render(<Profile />)
    });
    expect(screen.getByTestId("profile-container")).toContainHTML("Bill")
    expect(screen.getByTestId("profile-container")).toContainHTML("mypicture")
  });
  it('nothing is rendered when logged out', async() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false
    })
    await act(async () => {
      render(<Profile />)
    });
    expect(screen.queryByTestId("profile-container")).toBeNull()
  });
  it('loading message when still loading', async() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      isLoading: true
    })
    await act(async () => {
      render(<Profile />)
    });
    expect(screen.queryByTestId("profile-container")).toContainHTML("Loading...")
  });
});
