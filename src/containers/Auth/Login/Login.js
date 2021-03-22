import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import Input from '../../../components/UI/Input/Input';
import {
  authFail,
  authStart,
  authReset,
  authSuccess,
} from '../../../store/actions/index';

const Login = (props) => {
  const [emailInput, setEmailInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'email',
      placeholder: 'Your Email Address',
    },
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    id: 1,
  });

  const [passwordInput, setPasswordInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'password',
      placeholder: 'Password',
    },
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    id: 2,
  });

  const [errorMessage, setErrorMessage] = useState('');

  // const loading = useSelector((state) => state.auth.loading);
  // const error = useSelector((state) => state.auth.error);
  // const isAuthenticated = useSelector((state) => state.auth.user !== null);
  const dispatch = useDispatch();

  const updatePassword = (e) => {
    setPasswordInput({ ...passwordInput, value: e.target.value });
  };

  const updateEmail = (e) => {
    setEmailInput({ ...emailInput, value: e.target.value });
  };

  const updateFunctions = [updateEmail, updatePassword];
  const formFields = [emailInput, passwordInput];

  const submitLogin = () => {
    dispatch(authStart());
    props.firebase
      .doSignInWithEmailAndPassword(emailInput.value, passwordInput.value)
      .then((userCredential) => {
        dispatch(authSuccess(userCredential.user));
        setErrorMessage('');
      })
      .catch((err) => {
        dispatch(authFail(err));
        dispatch(authReset());
        setErrorMessage(err.message);
      });
  };

  const form = formFields.map((el, i) => (
    <Input
      elementType={el.elementType}
      elementConfig={el.elementConfig}
      key={el.id}
      value={el.value}
      changed={updateFunctions[i]}
    />
  ));

  return (
    <>
      <div>
        {errorMessage ? <p>{errorMessage}</p> : null}
        {form}
        <button onClick={submitLogin}>Login</button>
      </div>
      <Link to="/register">Register</Link>
    </>
  );
};

export default Login;
