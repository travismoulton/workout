import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Input from '../UI/Input/Input';

const SendPasswordResetEmail = (props) => {
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
    label: 'Email Address',
    id: 1,
  });

  const [error, setError] = useState(null);
  const [passwordRest, setPasswordReset] = useState(false);

  useEffect(() => {
    if (error) if (emailInput.value && error.code === 'noEmail') setError(null);
  }, [error, emailInput]);

  const onSubmit = () => {
    if (emailInput.value) {
      props.firebase
        .doPasswordReset(emailInput.value)
        .then(() => setPasswordReset(true))
        .catch((err) => setError({ msg: <p>{err.message}</p> }));
    } else {
      setError({
        isError: true,
        msg: (
          <p style={{ color: 'red' }}>
            Must provide an email in order to reset
          </p>
        ),
        code: 'noEmail',
      });
    }
  };

  const submitBtn = <button onClick={onSubmit}>Reset password</button>;

  const inputField = (
    <Input
      elementType={emailInput.elementType}
      elementConfig={emailInput.elementConfig}
      label={emailInput.label}
      changed={(e) => setEmailInput({ ...emailInput, value: e.target.value })}
      value={emailInput.value}
    />
  );

  const afterRestDisplay = passwordRest ? (
    <>
      <p>If an account with that password exists, an email will be sent.</p>
      <Link to="/login">
        Return to the login page after resetting your password
      </Link>
    </>
  ) : null;

  return (
    <>
      {error ? error.msg : null}
      {afterRestDisplay}
      {inputField}
      {submitBtn}
    </>
  );
};

export default SendPasswordResetEmail;
