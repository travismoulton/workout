import { useSelector } from 'react-redux';

// import DrawerToggle from '../DrawerToggle/DrawerToggle';
import NavItem from './NavItem/NavItem';
import classes from './NavItems.module.css';

const NavItems = (props) => {
  const user = useSelector((state) => state.auth.user);
  const style = user
    ? [classes.NavItems, classes.IsAuthenticated]
    : [classes.NavItems, classes.NotAuthenticated];

  return (
    <>
      <ul className={style.join(' ')}>
        <NavItem link="/search">Search</NavItem>
        {props.isAuthenticated ? (
          <>
            <NavItem link="/my-profile">
              {user.authUser ? user.authUser.displayName : null}
            </NavItem>
            <NavItem link="/create-workout">Create Workout</NavItem>
            <NavItem link="/create-routine">Create Routine</NavItem>
            <NavItem link="/create-exercise">Create Exercise</NavItem>
            <NavItem link="/record-workout">Record a Workout</NavItem>
            <NavItem link="/logout">Logout</NavItem>
          </>
        ) : (
          <NavItem link="/login">Login</NavItem>
        )}
      </ul>
    </>
  );
};

export default NavItems;
