import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUserAction } from '../redux/actions/userActions';
import PropTypes from 'prop-types';

// MUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

/** Shows the log in or log out button
 * @param {{isLoggedIn:boolean, logout:()=>void}} props
 */
const ButtonLogInOut = ({ isLoggedIn, logout }) => {
  if (isLoggedIn) {
    return (
      <Button
        color='inherit'
        component={Link}
        to='/'
        onClick={() => {
          logout();
        }}
      >
        Logout
      </Button>
    );
  }
  return (
    <Button color='inherit' component={Link} to='/login'>
      Login
    </Button>
  );
};

ButtonLogInOut.propTypes = {
  isLoggedIn: PropTypes.bool,
  logout: PropTypes.func,
};

/** Displays either signup button or empty div
 * @param {*} param0 
 */
const ButtonRegister = ({ isLoggedIn }) => {
  if (isLoggedIn) {
    return <div></div>;
  }
  return (
    <Button color='inherit' component={Link} to='/signup'>
      Signup
    </Button>
  );
};

ButtonRegister.propTypes = {
  isLoggedIn: PropTypes.bool,
};

/** View component for navbar
 * @param {{isLoggedIn:bool, logoutUserAction:()=>void}} props
 */
const Navbar = ({ isLoggedIn = false, logoutUserAction }) => (
  <AppBar>
    <Toolbar className='nav-container'>
      <Button color='inherit' component={Link} to='/'>
        Home
      </Button>
      <ButtonLogInOut isLoggedIn={isLoggedIn} logout={logoutUserAction} />
      <ButtonRegister isLoggedIn={isLoggedIn} />
    </Toolbar>
  </AppBar>
);
Navbar.propTypes = {
  isLoggedIn: PropTypes.bool,
  logoutUserAction: PropTypes.func,
};

const mapStateToProps = ({ user }) => ({ isLoggedIn: !!user && !!user.handle });

const mapActionsToProps = {
  logoutUserAction,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Navbar);
