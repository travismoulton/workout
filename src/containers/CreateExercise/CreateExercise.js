import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import SubmitExerciseBtn from './SubmitExerciseBtn/SubmitExerciseBtn';
import { updateObject, checkValidityHandler } from '../../shared/utility';

const CreateExercise = () => {
  const { user } = useSelector((state) => state.auth);
  const wgerDict = useSelector((state) => state.wgerDict);
  const [muscleSelectOptionsDone, setMuscleSelectOptionsDone] = useState(false);

  const [formIsValid, setFormIsValid] = useState(false);
  const [exerciseNameInput, setExerciseNameInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Workout name',
    },
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    id: 'name',
  });
  const [categoryInput, setCategoryInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: [
        { value: 0, displayValue: '' },
        { value: 10, displayValue: 'Abs' },
        { value: 8, displayValue: 'Arms' },
        { value: 12, displayValue: 'Back' },
        { value: 14, displayValue: 'Calves' },
        { value: 11, displayValue: 'Chest' },
        { value: 9, displayValue: 'Legs' },
        { value: 13, displayValue: 'Shoulders' },
        { value: 99, displayValue: 'All Body' },
        { value: 98, displayValue: 'Cardio' },
      ],
    },
    value: 0,
    label: 'Exercise Category',
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    id: 'category',
  });
  const [primaryMuscleInput, setPrimaryMuscleInputInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: [{ value: 0, displayValue: '' }],
    },
    value: 0,
    label: 'Primary Muscle',
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    id: 'primaryMuscle',
  });
  const [equipmentInput, setEquipmentInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: [
        { value: 0, displayValue: '' },
        { value: 1, displayValue: 'Barbell' },
        { value: 8, displayValue: 'Bench' },
        { value: 3, displayValue: 'Dumbbell' },
        { value: 4, displayValue: 'Gym mat' },
        { value: 9, displayValue: 'Incline bench' },
        { value: 10, displayValue: 'Kettlebell' },
        { value: 7, displayValue: 'Body weight' },
        { value: 6, displayValue: 'Pull-up bar' },
        { value: 5, displayValue: 'Swiss Ball' },
        { value: 2, displayValue: 'SZ-Bar' },
      ],
    },
    value: 0,
    label: 'Equipment',
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    id: 'equipment',
  });

  const formFields = [
    exerciseNameInput,
    categoryInput,
    primaryMuscleInput,
    equipmentInput,
  ];

  useEffect(() => {
    if (!muscleSelectOptionsDone) {
      let options = [{ value: 0, displayValue: '' }];
      for (const key in wgerDict.muscles) {
        options.push({ value: key, displayValue: wgerDict.muscles[key].name });
      }
      setPrimaryMuscleInputInput({
        ...primaryMuscleInput,
        elementConfig: { ...primaryMuscleInput.elementConfig, options },
      });
      setMuscleSelectOptionsDone(true);
    }
  }, [muscleSelectOptionsDone, wgerDict, primaryMuscleInput]);

  const inputChangedHandler = (e, input) => {
    const updatedInput = updateObject(input, {
      value: e.target.value,
      valid: checkValidityHandler(e.target.value, input.validation),
      touched: true,
    });

    input.id === 'name'
      ? setExerciseNameInput(updatedInput)
      : input.id === 'category'
      ? setCategoryInput(updatedInput)
      : input.id === 'primaryMuscle'
      ? setPrimaryMuscleInputInput(updatedInput)
      : input.id === 'equipment'
      ? setEquipmentInput(updatedInput)
      : // TODO: Need actional error handling
        console.log('error');

    if (input.id === 'name') setFormIsValid(updatedInput.valid);
  };

  const form = formFields.map((field) => (
    <Input
      elementConfig={field.elementConfig}
      elementType={field.elementType}
      value={field.value}
      label={field.label}
      key={field.id}
      changed={(e) => inputChangedHandler(e, field)}
    />
  ));

  return (
    <>
      {form}
      <SubmitExerciseBtn isValid={formIsValid} userId={user.authUser.uid} />
    </>
  );
};

export default CreateExercise;
