import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../../components/UI/Input/Input';
import {
  setFormData,
  setExercises,
  setEntireForm,
  resetWorkoutStore,
  setFirebaseId,
} from '../../../store/actions';
import { updateObject, checkValidityHandler } from '../../../shared/utility';

const WorkoutDetailsForm = (props) => {
  const { formData } = useSelector((state) => state.workout);
  const dispatch = useDispatch();

  const [workoutNameInput, setWorkoutNameInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Workout name',
    },
    value: formData.workoutName,
    validation: {
      required: true,
    },
    valid: formData.workoutName ? true : false,
    touched: false,
    id: 'workoutName',
    className: 'WorkoutName',
  });

  const [targetAreaInput, setTargetAreaInput] = useState({
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
        { value: 1, displayValue: 'All Body' },
      ],
    },
    value: formData.targetArea,
    label: 'Target Muscle Area',
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    id: 'targetArea',
    className: 'CreateWorkoutSelect',
  });

  const [secondaryTargetAreaInput, setSecondaryTargetAreaInput] = useState({
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
      ],
    },
    value: formData.secondaryTarget,
    label: ' Secondary Target',
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    id: 'secondaryTarget',
    className: 'CreateWorkoutSelect',
  });

  useEffect(() => {
    if (props.shouldLoadWorkoutData) {
      const { workout } = props.history.location.state;

      if (workout) {
        dispatch(setExercises(workout.exercises));
        dispatch(
          setEntireForm(
            workout.title,
            workout.targetArea,
            workout.secondaryTargetArea
          )
        );

        if (workout.title)
          setWorkoutNameInput({ ...workoutNameInput, value: workout.title });

        if (workout.targetArea)
          setTargetAreaInput({
            ...targetAreaInput,
            value: workout.targetAreaCode,
          });

        if (workout.secondaryTargetArea)
          setSecondaryTargetAreaInput({
            ...secondaryTargetAreaInput,
            value: workout.secondaryTargetCode,
          });

        props.setOriginalTitle(workout.title);
        props.setFormIsValid(true);
        props.setShouldLoadWorkoutDataToFalse();
        dispatch(setFirebaseId(workout.firebaseId));
      }
    }
  }, [
    props,
    dispatch,
    secondaryTargetAreaInput,
    targetAreaInput,
    workoutNameInput,
  ]);

  const formFields = [
    workoutNameInput,
    targetAreaInput,
    secondaryTargetAreaInput,
  ];

  const inputChangedHandler = (e, input) => {
    const updatedInput = updateObject(input, {
      value: e.target.value,
      valid: checkValidityHandler(e.target.value, input.validation),
      touched: true,
    });

    if (input.id === 'workoutName') props.setFormIsValid(updatedInput.valid);

    input.id === 'workoutName'
      ? setWorkoutNameInput(updatedInput)
      : input.id === 'targetArea'
      ? setTargetAreaInput(updatedInput)
      : setSecondaryTargetAreaInput(updatedInput);

    dispatch(setFormData(formData, input.id, e.target.value));
  };

  const titleForm = formFields.map((field) => (
    <Input
      elementType={field.elementType}
      elementConfig={field.elementConfig}
      key={field.id}
      value={field.value}
      changed={(e) => inputChangedHandler(e, field)}
      label={field.label}
      touched={field.touched}
      invalid={!field.valid}
      classname={field.className}
    />
  ));

  const setInputAsTouched = useCallback(() => {
    setWorkoutNameInput({ ...workoutNameInput, touched: true });
  }, [workoutNameInput]);

  const clearAllFormInputs = useCallback(() => {
    setWorkoutNameInput({ ...workoutNameInput, value: '' });
    setTargetAreaInput({ ...targetAreaInput, value: '' });
    setSecondaryTargetAreaInput({ ...secondaryTargetAreaInput, value: '' });
  }, [secondaryTargetAreaInput, workoutNameInput, targetAreaInput]);

  const clearAllWorkoutData = useCallback(() => {
    clearAllFormInputs();
    dispatch(resetWorkoutStore());
  }, [clearAllFormInputs, dispatch]);

  useEffect(() => {
    if (props.shouldSetInputAsTouched) {
      setInputAsTouched(true);
      props.shouldSetInputAsTouchedToFalse();
    }
  }, [props, setInputAsTouched]);

  useEffect(() => {
    if (props.shouldClearFormInputs) {
      clearAllWorkoutData();
      props.setShouldClearFormInputsToFalse();
    }
  }, [props, clearAllWorkoutData]);

  return titleForm;
};

export default WorkoutDetailsForm;
