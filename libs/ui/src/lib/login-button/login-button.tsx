import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';

export function LoginButton() {
  const { isLoading, loginWithRedirect, isAuthenticated } = useAuth0();
  if (!isLoading && !isAuthenticated) {
    loginWithRedirect()
    return null
  } else {
    return <div/>
  }
}

export default LoginButton;
