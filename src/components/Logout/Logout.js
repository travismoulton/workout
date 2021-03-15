import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { logout } from '../../store/actions';

const Logout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logout());
  });

  return <Redirect to="/" />;
};

export default Logout;
