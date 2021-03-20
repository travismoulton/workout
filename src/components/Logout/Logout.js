import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { logout } from '../../store/actions';

const Logout = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    props.firebase.doSignOut();
    dispatch(logout());
  });

  return <Redirect to="/" />;
};

export default Logout;
