import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import Input from '../../../components/UI/Input/Input';
import {
  authFail,
  authStart,
  authReset,
  authSuccess,
} from '../../../store/actions/index';
import classes from './Login.module.css';

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
    label: 'Email address',
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
    label: 'Password',
    valid: false,
    touched: false,
    id: 2,
  });

  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'Login';
  }, []);

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
        console.log(userCredential.user);
        dispatch(authSuccess(userCredential.user));
        setErrorMessage('');
      })
      .catch((err) => {
        dispatch(authFail(err));
        dispatch(authReset());
        setErrorMessage(err.message);
      });
  };

  // Redirect by checking for authUser. If there is a user, check for authUser property.
  // If authUser property, redirect to my-profile
  const redirect = user ? (
    user.authUser ? (
      <Redirect to="/my-profile" />
    ) : null
  ) : null;

  const form = formFields.map((el, i) => (
    <Input
      elementType={el.elementType}
      elementConfig={el.elementConfig}
      key={el.id}
      value={el.value}
      changed={updateFunctions[i]}
      label={el.label}
      classname="LoginInput"
      wrapperClass="LoginInputWrapper"
    />
  ));

  return (
    <>
      {redirect}
      <div>
        {errorMessage ? <p>{errorMessage}</p> : null}
        {form}
        <button className={`GlobalBtn-1 ${classes.Btn}`} onClick={submitLogin}>
          Login
        </button>
      </div>
      <div className={classes.Links}>
        <p>
          Don't have an account?{' '}
          <Link className={classes.Link} to="/register">
            Register
          </Link>{' '}
          here
        </p>
        <Link className={classes.Link} to="/forgot-password">
          Forgot Password?
        </Link>
      </div>
    </>
  );
};

export default Login;
