import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { login } from '../../../store/actions/index';
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
    id: 2,
  });

  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.user !== null);
  const dispatch = useDispatch();

  const updateEmail = (e) => {
    setEmailInput({ ...emailInput, value: e.target.value });
  };

  const updatePassword = (e) => {
    setPasswordInput({ ...passwordInput, value: e.target.value });
  };

  const updateConfirmPW = (e) => {
    setConfirmPW({ ...confirmPWInput, value: e.target.value });
  };

  const updateFunctions = [updateEmail, updatePassword, updateConfirmPW];
  const formFields = [emailInput, passwordInput, confirmPWInput];

  const submitRegister = () => {
    props.firebase
      .doCreateUserWithEmailAndPassword(emailInput.value, passwordInput.value)
      .then((userCredential) => {
        console.log(userCredential);
        dispatch(login(userCredential.user));
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
    <div>
      {form}
      <button onClick={submitRegister}>Register</button>
    </div>
  );
};

export default Register;
