import React from 'react';

// Components
import { UserProfileDisplay } from './user';
import { DefaultProfileDisplay } from './default/DefaultProfileDisplay';

// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import style from '../../style';

// Redux
import { connect } from 'react-redux';

/** View component for displaying either the default or user profile
 * @type {React.FunctionComponent}
 * @param {object} props
 * @param {object} props.classes
 * @param {boolean} props.user.isLoading
 * @param {boolean} props.user.authenticated
 */
const ProfileView = ({ classes = {}, user: { isLoading, authenticated } }) => {
  if (!isLoading) {
    if (authenticated) {
      return <UserProfileDisplay classes={classes} />;
    } else {
      return <DefaultProfileDisplay classes={classes} />;
    }
  } else {
    return <p>loading...</p>;
  }
};

const mapStateToProps = ({ user }) => ({ user });

export const Profile = connect(mapStateToProps)(withStyles(style)(ProfileView));
