import { useState } from 'react';

import Input from '../../../components/UI/Input/Input';

const ExerciseNameInput = (props) => {
  const [input, setInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Exercise name',
    },
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    id: 'name',
    className: 'ExerciseName',
  });

  return (
    <Input
      elementType={input.elementType}
      elementConfig={input.elementConfig}
      value={input.value}
      changed={(e) => setInput({ ...input, value: e.target.value })}
      label={input.label}
      classname={input.className}
    />
  );
};

export default ExerciseNameInput;
