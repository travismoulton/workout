import { useState } from 'react';

import Nav from '../Navigation/Nav/Nav';
import SideBar from '../Navigation/SideBar/SideBar';
import classes from './Layout.module.css';

const Layout = (props) => {
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <>
      <Nav
        isAuthenticated={props.isAuthenticated}
        toggleSideBar={() =>
          setShowSideBar((prevShowSideBar) => !prevShowSideBar)
        }
      />
      <SideBar
        show={showSideBar}
        closed={() => setShowSideBar(false)}
        isAuthenticated={props.isAuthenticated}
      />
      <main className={classes.Main}>{props.children}</main>
    </>
  );
};
export default Layout;
