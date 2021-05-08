import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import uniqid from 'uniqid';
import axios from 'axios';

import Input from '../../components/UI/Input/Input';
import WorkoutListItem from '../WorkoutListItem/WorkoutListItem';
import SubmitWorkoutBtn from '../../components/SubmitWorkoutBtn/SubmitWorkoutBtn';
import Spinner from '../../components/UI/Spinner/Spinner';
import {
  startSearchMode,
  addExercise,
  setFormData,
  setExercises,
  setEntireForm,
  resetWorkoutStore,
  setFirebaseId,
} from '../../store/actions';
import { updateObject, checkValidityHandler } from '../../shared/utility';
import wgerDict from '../../shared/wgerDict';

const CreateWorkout = (props) => {
  const { favorites } = useSelector((state) => state.favorites);
  const { exercises } = useSelector((state) => state.workout);
  const { formData } = useSelector((state) => state.workout);
  const { firebaseId } = useSelector((state) => state.workout);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [favoritesAsExercises, setFavoritesAsExercises] = useState([]);
  const [favoritesAsSelectOptions, setFavoritesAsSelectOptions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [historyUsed, setHistoryUsed] = useState(false);

  // const [firebaseId, setFirebaseId] = useState('');

  const [originalTitle, setOriginalTitle] = useState('');
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
    let arr = [];

    (async () => {
      if (favorites && !favoritesAsExercises.length) {
        await axios
          .get(
            `https://workout-81691-default-rtdb.firebaseio.com/masterExerciseList.json`
          )
          .then((res) => {
            for (const key in res.data) {
              const exercise = favorites.filter(
                (fav) => fav.exercise * 1 === res.data[key].id
              )[0];

              if (exercise) arr.push(res.data[key]);
            }
          });

        await axios
          .get(
            `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${user.authUser.uid}.json`
          )
          .then((res) => {
            for (const key in res.data) {
              const exercise = favorites.filter(
                (fav) => fav.exercise === res.data[key].id
              )[0];

              if (exercise) arr.push(res.data[key]);
            }
          });

        setFavoritesAsExercises(arr);
      }
    })();
  }, [favorites, favoritesAsExercises, user.authUser.uid]);

  useEffect(() => {
    // After favoritesAsExercises has been created, create an array of objects to
    // be used as select options inside the Add from favroites dropdown
    if (favoritesAsExercises.length && !favoritesAsSelectOptions.length) {
      setFavoritesAsSelectOptions(
        favoritesAsExercises.map((exercise) => ({
          value: exercise.id,
          displayValue: exercise.name,
        }))
      );
      // Once the select options have been set, load the page
      setLoaded(true);
    }
  }, [favoritesAsExercises, favoritesAsSelectOptions]);

  useEffect(() => {
    // If there are no favorites, the page can be loaded immediatley
    if (favorites) if (!favorites.length && !loaded) setLoaded(true);
  }, [favorites, loaded]);

  // If taken to the create-workout component as a workout detail, load the
  // exercises and populate the form from state.
  useEffect(() => {
    if (props.history.location.state && !historyUsed) {
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
    const exercise = favoritesAsExercises.filter(
      (fav) => fav.id.toString() === e.target.value
    )[0];

    dispatch(
      addExercise({
        name: exercise.name,
        id: uniqid(`${exercise.id}-`),
        sets: [{ weight: 0, reps: 1 }],
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

  const finalDisplay = (
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
              targetAreaInput.value
                ? wgerDict.exerciseCategoryList[targetAreaInput.value]
                : null
            }
            secondaryTargetArea={
              secondaryTargetAreaInput.value
                ? wgerDict.exerciseCategoryList[secondaryTargetAreaInput.value]
                : null
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
    </>
  );

  return loaded ? finalDisplay : <Spinner />;
};

export default CreateWorkout;
