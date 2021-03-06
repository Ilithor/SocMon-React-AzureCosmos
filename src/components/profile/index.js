import React from 'react';

// Components
import { UserProfile } from './user';
import { DefaultProfile } from './default';

// MUI
import { CircularProgress } from '@material-ui/core';
import { useStyles } from './profile.style';

// Context
import { useAuthenticationData } from './authenticationContext';

/** View component for displaying either the default or user profile
 *
 * @returns {React.FunctionComponent}
 */
export const Profile = () => {
  const classes = useStyles();
  const { isAuthenticated, isLoadingAuthentication } = useAuthenticationData();

  if (!isLoadingAuthentication) {
    if (isAuthenticated) {
      return <UserProfile classes={classes} />;
    } else {
      return <DefaultProfile classes={classes} />;
    }
  } else {
    return (
      <div className={classes?.spinnerDiv}>
        <CircularProgress size={150} thickness={2} />
      </div>
    );
  }
};
