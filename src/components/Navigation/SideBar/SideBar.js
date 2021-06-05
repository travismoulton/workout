import NavItems from '../NavItems/NavItems';
import Backdrop from '../../UI/Backdrop/Backdrop';
import classes from './SideBar.module.css';

const SideBar = (props) => {
  const style = props.show
    ? [classes.SideBar, classes.Open]
    : [classes.SideBar, classes.Closed];

  return (
    <>
      <Backdrop show={props.show} clicked={props.closed} />
      <div className={style.join(' ')} onClick={props.closed}>
        <nav className={classes.Nav}>
          <NavItems isAuthenticated={props.isAuthenticated} inSideBar />
        </nav>
      </div>
    </>
  );
};

export default SideBar;
