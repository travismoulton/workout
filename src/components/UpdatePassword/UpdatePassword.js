import { useState } from 'react';
import { useSelector } from 'react-redux';

import Input from '../UI/Input/Input';

const UpdatePassword = (props) => {
  const { email } = useSelector((state) => state.auth.user.authUser);
  const [currentPasswordInput, setCurrentPasswordInput] = useState({
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
    label: 'Current password',
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
    label: 'New password',
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
    label: 'Confirm new password',
    id: 4,
  });

  const updateCurrentPassword = (e) => {
    setCurrentPasswordInput({
      ...currentPasswordInput,
      value: e.target.value,
    });
  };

  const updatePassword = (e) => {
    setPasswordInput({ ...passwordInput, value: e.target.value });
  };

  const updateConfirmPW = (e) => {
    setConfirmPW({ ...confirmPWInput, value: e.target.value });
  };

  const updateFunctions = [
    updateCurrentPassword,
    updatePassword,
    updateConfirmPW,
  ];
  const formFields = [currentPasswordInput, passwordInput, confirmPWInput];

  const form = formFields.map((field, i) => (
    <Input
      key={field.id}
      elementConfig={field.elementConfig}
      elementType={field.elementType}
      label={field.label}
      value={field.value}
      changed={updateFunctions[i]}
    />
  ));

  const onSumbit = () => {
    const credential = props.firebase.generateCredntial(
      email,
      currentPasswordInput.value
    );

    if (
      currentPasswordInput.value &&
      passwordInput.value &&
      passwordInput.value === confirmPWInput.value
    )
      props.firebase
        .doReauthenticate(credential)
        .then(() => props.firebase.doPasswordUpdate(passwordInput.value))
        .catch((err) => console.log(err))
        .catch((err) => console.log(err));
  };

  const submitBtn = <button onClick={onSumbit}>Update your password</button>;

  return (
    <>
      {form}
      {submitBtn}
    </>
  );
};

export default UpdatePassword;
