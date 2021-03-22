import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { authFail, authStart, authReset } from '../../../store/actions/index';
import Input from '../../../components/UI/Input/Input';

const Register = (props) => {
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

  const [userNameInput, setUserNameInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Your User Name',
    },
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    id: 2,
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
    id: 3,
  });

  const [confirmPWInput, setConfirmPW] = useState({
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
    id: 4,
  });

  const [errorMessage, setErrorMessage] = useState('');

  // const loading = useSelector((state) => state.auth.loading);
  // const error = useSelector((state) => state.auth.error);
  // const isAuthenticated = useSelector((state) => state.auth.user !== null);
  const dispatch = useDispatch();

  const updateEmail = (e) => {
    setEmailInput({ ...emailInput, value: e.target.value });
  };

  const updateUserName = (e) => {
    setUserNameInput({ ...userNameInput, value: e.target.value });
  };

  const updatePassword = (e) => {
    setPasswordInput({ ...passwordInput, value: e.target.value });
  };

  const updateConfirmPW = (e) => {
    setConfirmPW({ ...confirmPWInput, value: e.target.value });
  };

  const updateFunctions = [
    updateEmail,
    updateUserName,
    updatePassword,
    updateConfirmPW,
  ];
  const formFields = [emailInput, userNameInput, passwordInput, confirmPWInput];

  const submitRegister = () => {
    if (passwordInput.value === confirmPWInput.value) {
      setErrorMessage('');
      dispatch(authStart());

      props.firebase
        .doCreateUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then((userCredential) => {
          props.firebase.updateUserProfile(userNameInput.value).then(() => {
            dispatch(authReset());
          });
        })
        .catch((err) => {
          dispatch(authFail(err));
          dispatch(authReset());
          setErrorMessage(err.message);
        });

      props.history.push('/');
    } else {
      setErrorMessage('Passwords do not match');
    }
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
    <div>
      {errorMessage ? <p>{errorMessage}</p> : null}
      {form}
      <button onClick={submitRegister}>Register</button>
    </div>
  );
};

export default Register;
