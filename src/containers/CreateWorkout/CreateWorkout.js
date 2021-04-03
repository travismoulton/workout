import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import Input from '../../components/UI/Input/Input';
import WorkoutListItem from '../WorkoutListItem/WorkoutListItem';
import SubmitWorkoutBtn from '../../components/SubmitWorkoutBtn/SubmitWorkoutBtn';
import { startSearchMode, addExercise, setFormData } from '../../store/actions';
import { updateObject, checkValidityHandler } from '../../shared/utility';

const CreateWorkout = (props) => {
  const { favorites } = useSelector((state) => state.favorites);
  const { exercises } = useSelector((state) => state.workout);
  const { formData } = useSelector((state) => state.workout);
  const dispatch = useDispatch();
  const [favoritesAsExercies, setFavoritesAsExercies] = useState([]);
  const [favoritesAsSelectOptions, setFavoritesAsSelectOptions] = useState([]);
  // The form should be valid if the component renders with a workoutName coming from redux
  const [formIsValid, setFormIsValid] = useState(
    formData.workoutName ? true : false
  );

  useEffect(() => {
    let arr = [];

    (async () => {
      if (favorites) {
        arr = favorites.map((fav) =>
          axios
            .get(`https://wger.de/api/v2/exercise/${fav.exercise}`)
            .then((res) => res.data)
        );

        if (!favoritesAsExercies.length)
          setFavoritesAsExercies(await Promise.all(arr));
      }
    })();
  }, [favoritesAsExercies, favorites]);

  useEffect(() => {
    if (favoritesAsExercies.length && !favoritesAsSelectOptions.length)
      setFavoritesAsSelectOptions(
        favoritesAsExercies.map((exercise) => ({
          value: exercise.id,
          displayValue: exercise.name,
        }))
      );
  }, [favoritesAsExercies, favoritesAsSelectOptions]);

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

  const [addFromFavorites, setAddFromFavorites] = useState({
    elementType: 'select',
    elementConfig: {
      options: [],
    },
    value: 0,
    label: 'Add exercise from favorites',
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    id: 4,
  });

  useEffect(() => {
    if (
      favoritesAsSelectOptions.length &&
      !addFromFavorites.elementConfig.options.length
    )
      setAddFromFavorites({
        ...addFromFavorites,
        elementConfig: {
          ...addFromFavorites.elementConfig,
          options: [
            { value: 0, displayValue: null },
            ...favoritesAsSelectOptions,
          ],
        },
      });
  }, [addFromFavorites, favoritesAsSelectOptions]);

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

  const addExerciseFromFavorites = (e) => {
    const exercise = favoritesAsExercies.filter(
      (fav) => fav.id === e.target.value * 1
    )[0];

    dispatch(
      addExercise({
        name: exercise.name,
        id: exercise.id,
        weight: 0,
        sets: 1,
        reps: 1,
      })
    );
  };

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

  return (
    <>
      {titleForm}
      <Input
        elementType={addFromFavorites.elementType}
        elementConfig={addFromFavorites.elementConfig}
        label={addFromFavorites.label}
        value={addFromFavorites.value}
        changed={(e) => addExerciseFromFavorites(e)}
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
                weight={exercise.weight}
                sets={exercise.sets}
                reps={exercise.reps}
                firstExercise={i === 0}
                lastExercise={i === exercises.length - 1}
              />
            ))}
          </ul>
          <SubmitWorkoutBtn
            title={workoutNameInput.value}
            targetArea={targetAreaInput.value}
            secondaryTarget={secondaryTargetAreaInput.value}
            formIsValid={formIsValid}
            clearAllFormInputs={clearAllFormInputs}
            setInputAsTouched={setInputAsTouched}
          />
        </>
      ) : null}
    </>
  );
};

export default CreateWorkout;
