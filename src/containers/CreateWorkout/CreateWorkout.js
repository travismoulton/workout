import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import WorkoutListItem from '../WorkoutListItem/WorkoutListItem';
import SubmitWorkoutBtn from '../../components/SubmitWorkoutBtn/SubmitWorkoutBtn';
import Spinner from '../../components/UI/Spinner/Spinner';
import FavoritesSelectMenu from './FavoritesSelectMenu/FavoritesSelectMenu';
import {
  startSearchMode,
  setFormData,
  setExercises,
  setEntireForm,
  resetWorkoutStore,
  setFirebaseId,
} from '../../store/actions';
import { updateObject, checkValidityHandler } from '../../shared/utility';
import wgerDict from '../../shared/wgerDict';

const CreateWorkout = (props) => {
  const { exercises } = useSelector((state) => state.workout);
  const { formData } = useSelector((state) => state.workout);
  const { firebaseId } = useSelector((state) => state.workout);

  const dispatch = useDispatch();

  const [loaded, setLoaded] = useState(false);
  const [historyUsed, setHistoryUsed] = useState(false);
  const [originalTitle, setOriginalTitle] = useState('');
  const [error, setError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        Sorry, something went wrong trying to get some of your favorites. Please
        refresh the page or try again later
      </p>
    ),
  });
  // The form should be valid if the component renders with a workoutName coming from redux
  const [formIsValid, setFormIsValid] = useState(
    formData.workoutName ? true : false
  );

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
  });

  useEffect(() => {
    if (error.isError) setLoaded(true);
  }, [error, loaded]);

  // If taken to the create-workout component as a workout detail, load the
  // exercises and populate the form from state.
  useEffect(() => {
    const shouldLoadWorkoutData = props.history.location.state && !historyUsed;
    if (shouldLoadWorkoutData) {
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

        setOriginalTitle(workout.title);
        setFormIsValid(true);
        setHistoryUsed(true);
        dispatch(setFirebaseId(workout.firebaseId));
      }
    }
  }, [
    props.history.location.state,
    dispatch,
    historyUsed,
    targetAreaInput,
    workoutNameInput,
    secondaryTargetAreaInput,
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

    if (input.id === 'workoutName') setFormIsValid(updatedInput.valid);

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
    />
  ));

  const onAddExerciseBySearchClick = () => {
    dispatch(startSearchMode());
    props.history.push('/search');
  };

  const setInputAsTouched = () => {
    setWorkoutNameInput({ ...workoutNameInput, touched: true });
  };

  const clearAllFormInputs = () => {
    setWorkoutNameInput({ ...workoutNameInput, value: '' });
    setTargetAreaInput({ ...targetAreaInput, value: '' });
    setSecondaryTargetAreaInput({ ...secondaryTargetAreaInput, value: '' });
  };

  const clearAllWorkoutData = () => {
    clearAllFormInputs();
    dispatch(resetWorkoutStore());
  };

  const clearWorkoutBtn = (
    <button
      style={{ display: 'block', margin: '.5rem auto' }}
      onClick={clearAllWorkoutData}
    >
      Clear form
    </button>
  );

  return (
    <>
      <div style={{ display: !loaded && 'none' }}>
        {error.isError ? error.message : null}
        {titleForm}

        <FavoritesSelectMenu
          setLoaded={() => setLoaded(true)}
          setError={() => setError({ ...error, isError: true })}
        />

        <button onClick={onAddExerciseBySearchClick}>
          Add from exercise search menu
        </button>
        {exercises.length ? (
          <>
            <ul style={{ listStyle: 'none' }}>
              {exercises.map((exercise, i) => (
                <WorkoutListItem
                  name={exercise.name}
                  key={exercise.id}
                  id={exercise.id}
                  sets={exercise.sets}
                  isFirstExercise={i === 0}
                  isLastExercise={i === exercises.length - 1}
                />
              ))}
            </ul>
            <SubmitWorkoutBtn
              title={workoutNameInput.value}
              targetAreaCode={targetAreaInput.value}
              secondaryTargetCode={secondaryTargetAreaInput.value}
              targetArea={
                targetAreaInput.value &&
                wgerDict.exerciseCategoryList[targetAreaInput.value]
              }
              secondaryTargetArea={
                secondaryTargetAreaInput.value &&
                wgerDict.exerciseCategoryList[secondaryTargetAreaInput.value]
              }
              formIsValid={formIsValid}
              clearAllFormInputs={clearAllFormInputs}
              setInputAsTouched={setInputAsTouched}
              titleChanged={workoutNameInput.touched}
              firebaseId={firebaseId}
              originalTitleEntact={originalTitle === workoutNameInput.value}
              createNewWorkout={firebaseId === null}
              history={props.history}
            />
            {clearWorkoutBtn}
          </>
        ) : null}
      </div>

      <div style={{ display: loaded && 'none' }}>
        <Spinner />
      </div>
    </>
  );
};

export default CreateWorkout;
