import { useSelector } from 'react-redux';

import NavItem from './NavItem/NavItem';
import classes from './NavItems.module.css';

const NavItems = (props) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <ul className={classes.NavItems}>
      <NavItem link="/search">Search</NavItem>
      {props.isAuthenticated ? (
        <>
          <NavItem link="/my-profile">
            {user.authUser ? user.authUser.displayName : null}
          </NavItem>
          <NavItem link="/create-workout">Create Workout</NavItem>
          <NavItem link="/create-routine">Create Routine</NavItem>
          <NavItem link="/logout">Logout</NavItem>
        </>
      ) : (
        <NavItem link="/login">Login</NavItem>
      )}
    </ul>
  );
};

export default NavItems;
