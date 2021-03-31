import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import Input from '../../components/UI/Input/Input';
import WorkoutListItem from '../WorkoutListItem/WorkoutListItem';
import {
  startSearchMode,
  storeExercises,
  endSearchMode,
} from '../../store/actions';

const CreateWorkout = (props) => {
  // const user = useSelector((state) => state.auth.user);
  const favorites = useSelector((state) => state.favorites.favorites);
  // const wgerDict = useSelector((state) => state.wgerDict);
  const storedExercises = useSelector((state) => state.workout.exercises);
  const dispatch = useDispatch();
  const [favoritesAsExercies, setFavoritesAsExercies] = useState([]);
  const [favoritesAsSelectOptions, setFavoritesAsSelectOptions] = useState([]);
  const [exercises, setExercies] = useState([]);

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

  useEffect(() => {
    if (storedExercises.length && !exercises.length) {
      setExercies(storedExercises);
      dispatch(endSearchMode());
    }
  }, [storedExercises, dispatch, exercises]);

  const [workoutNameInput, setWorkoutNameInput] = useState({
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
    id: 1,
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
      ],
    },
    value: '',
    label: 'Target Muscle Area',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    id: 2,
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
    value: '',
    label: ' Secondary Target',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    id: 3,
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

  useEffect(() => {
    if (exercises.length) dispatch(storeExercises(exercises));
  }, [exercises, dispatch]);

  const setWorkoutNameValue = (e) => {
    setWorkoutNameInput({ ...workoutNameInput, value: e.target.value });
  };

  const setTargetAreaValue = (e) => {
    setTargetAreaInput({ ...targetAreaInput, value: e.target.value });
  };

  const setSecondaryTargetAreaValue = (e) => {
    setSecondaryTargetAreaInput({
      ...secondaryTargetAreaInput,
      value: e.target.value,
    });
  };

  const formFields = [
    workoutNameInput,
    targetAreaInput,
    secondaryTargetAreaInput,
  ];
  const updateFunctions = [
    setWorkoutNameValue,
    setTargetAreaValue,
    setSecondaryTargetAreaValue,
  ];

  const titleForm = formFields.map((field, i) => (
    <Input
      elementType={field.elementType}
      elementConfig={field.elementConfig}
      key={field.id}
      value={field.value}
      changed={updateFunctions[i]}
      label={field.label}
    />
  ));

  const addExerciseFromFavorites = (e) => {
    setAddFromFavorites({ ...addFromFavorites, value: e.target.value });

    const exercise = favoritesAsExercies.filter(
      (fav) => fav.id === e.target.value * 1
    )[0];

    setExercies(
      exercises.concat([
        { name: exercise.name, id: exercise.id, weight: 0, sets: 1, reps: 1 },
      ])
    );
  };

  const onAddExerciseBySearchClick = () => {
    dispatch(startSearchMode());

    props.history.push('/search');
  };

  const updateExerciseData = (exerciseId, param, val) => {
    const newExercises = exercises.map((exercise) =>
      exercise.id === exerciseId ? { ...exercise, [param]: val } : exercise
    );
    setExercies(newExercises);
  };

  const removeExercise = (exerciseId) => {
    const index = exercises.indexOf(
      exercises.filter((exercise) => exercise.id === exerciseId)[0]
    );

    console.log(exercises.length > 1);

    exercises.length > 1
      ? setExercies([
          ...exercises.slice(0, index),
          ...exercises.slice(index + 1),
        ])
      : setExercies([]);
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
        <ul style={{ listStyle: 'none' }}>
          {exercises.map((exercise) => (
            <WorkoutListItem
              name={exercise.name}
              key={exercise.id}
              id={exercise.id}
              updateExerciseData={updateExerciseData}
              weight={exercise.weight}
              sets={exercise.sets}
              reps={exercise.reps}
              removeExercise={removeExercise}
            />
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default CreateWorkout;
