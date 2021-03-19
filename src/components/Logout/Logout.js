import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { logout } from '../../store/actions';

const Logout = (props) => {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(logout());
  // });

  useEffect(() => {
    props.firebase.doSignOut();
  }, [props.firebase]);

  return <Redirect to="/" />;
};

export default Logout;
