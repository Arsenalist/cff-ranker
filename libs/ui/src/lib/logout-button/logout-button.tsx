import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@material-ui/core';

export function LogoutButton() {

  const { logout, isAuthenticated } = useAuth0();
  return (
    isAuthenticated &&
    (<Button data-testid="logout-button" variant="contained" onClick={() => logout({ returnTo: window.location.origin })}>Sign Out</Button>)
  );

}

export default LogoutButton;



