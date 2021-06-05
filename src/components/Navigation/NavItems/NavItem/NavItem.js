import { NavLink } from 'react-router-dom';

import classes from './NavItem.module.css';

const NavItem = (props) => (
  <li className={classes.NavItem}>
    <NavLink activeClassName={classes.active} exact to={props.link}>
      {props.children}
    </NavLink>
  </li>
);

export default NavItem;
