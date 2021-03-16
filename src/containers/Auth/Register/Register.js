import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../../components/UI/Input/Input';

import { register } from '../../../store/actions/index';

const Register = () => {
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
  const isAuthenticated = useSelector((state) => state.auth.token !== null);
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
    if (passwordInput.value === confirmPWInput.value)
      dispatch(register(emailInput.value, passwordInput.value));
    else throw new Error();
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
