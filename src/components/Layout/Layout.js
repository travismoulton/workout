import Nav from '../Nav/Nav';
import classes from './Layout.module.css';

const Layout = (props) => {
  return (
    <>
      <Nav isAuthenticated={props.isAuthenticated} />
      <main className={classes.Main}>{props.children}</main>
    </>
  );
};

export default Layout;