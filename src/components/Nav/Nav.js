import NavItems from '../NavItems/NavItems';
import classes from './Nav.module.css';

const Nav = (props) => (
  <header className={classes.Nav}>
    <nav className={classes.NavBar}>
      <NavItems isAuthenticated={props.isAuthenticated} />
    </nav>
  </header>
);

export default Nav;
