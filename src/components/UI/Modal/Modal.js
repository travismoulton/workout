import CSSTransition from 'react-transition-group/CSSTransition';

import './modal.css';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const Modal = (props) => {
  return (
    <>
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <CSSTransition
        in={props.show}
        timeout={100}
        mountOnEnter
        unmountOnExit
        classNames="modal"
      >
        <div className={classes.Modal}>{props.children}</div>
      </CSSTransition>
    </>
  );
};

export default Modal;
