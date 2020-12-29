import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import IconButton from '@material-ui/core/IconButton';
import { Avatar } from '@material-ui/core';

export function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return <div data-testid="profile-container">Loading...</div>;
  }
  return (
    isAuthenticated && (
      <div data-testid="profile-container">
        {user.name}
        <IconButton>
          <Avatar alt={user.name} src={user.picture}/>
        </IconButton>
      </div>
    )
  );
}

export default Profile;
