import NavItem from './NavItem/NavItem';
import classes from './NavItems.module.css';

const NavItems = (props) => {
  return (
    <ul className={classes.NavItems}>
      <NavItem link="/search">Search</NavItem>
      {props.isAuthenticated ? (
        <NavItem link="/logout">Logout</NavItem>
      ) : (
        <NavItem link="/login">Login</NavItem>
      )}
    </ul>
  );
};

export default NavItems;
