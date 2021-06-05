import DrawerToggle from '../DrawerToggle/DrawerToggle';
import NavItems from '../NavItems/NavItems';
import classes from './Nav.module.css';

const Nav = (props) => (
  <header className={classes.Nav}>
    <nav className={`${classes.NavBar} ${classes.Desktop}`}>
      <NavItems isAuthenticated={props.isAuthenticated} />
    </nav>
    <DrawerToggle clicked={props.toggleSideBar} />
  </header>
);

export default Nav;
