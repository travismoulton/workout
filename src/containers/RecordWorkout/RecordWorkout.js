import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import WorkoutListItem from '../WorkoutListItem/WorkoutListItem';
import RecordWorkoutBtn from '../../components/RecordWorkoutBtn/RecordWorkoutBtn';
import Spinner from '../../components/UI/Spinner/Spinner';
import RecordADifferentWorkout from '../../components/RecordADifferentWorkout/RecordADifferentWorkout';
import { setExercises, resetWorkoutStore } from '../../store/actions';

const RecordWorkout = (props) => {
  const [today] = useState(new Date());
  const [suggestedWorkout, setSuggestedWorkout] = useState(null);
  const [exercisesDispatched, setExercisesDispatched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { activeRoutine } = useSelector((state) => state.favorites);
  const { exercises } = useSelector((state) => state.workout);
  const { updated } = useSelector((state) => state.workout);
  const dispatch = useDispatch();

  useEffect(() => {
    const unlisten = props.history.listen((location, action) => {
      dispatch(resetWorkoutStore());
      unlisten();
    });
  });

  const adjustDateForSunday = useCallback(() => {
    return today.getDay() === 0 ? 6 : today.getDay() - 1;
  }, [today]);

  useEffect(() => {
    if (!suggestedWorkout) {
      if (activeRoutine) {
        const workoutFirebaseId = activeRoutine.workouts[adjustDateForSunday()];

        if (workoutFirebaseId !== 'Rest') {
          (async () =>
            await axios
              .get(
                `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}/${workoutFirebaseId}.json`
              )
              .then((res) =>
                setSuggestedWorkout({
                  ...res.data,
                  firebaseId: workoutFirebaseId,
                })
              ))();
        } else setLoading(false);
      } else setLoading(false);
    }
  }, [suggestedWorkout, adjustDateForSunday, activeRoutine, user.authUser.uid]);

  useEffect(() => {
    if (suggestedWorkout && !exercisesDispatched) {
      dispatch(setExercises(suggestedWorkout.exercises));
      setExercisesDispatched(true);
      setLoading(false);
    }
  }, [suggestedWorkout, dispatch, exercisesDispatched]);

  // If an exercise is removed, updated suggested workout and re-render
  useEffect(() => {
    if (
      exercises.length &&
      suggestedWorkout &&
      exercises.length !== suggestedWorkout.exercises.length
    )
      setSuggestedWorkout({ ...suggestedWorkout, exercises });
  }, [exercises, suggestedWorkout]);

  const displayExercises = suggestedWorkout
    ? exercises.map((exercise) => (
        <WorkoutListItem
          name={exercise.name}
          key={exercise.id}
          id={exercise.id}
          sets={exercise.sets}
          inRecordMode={true}
        />
      ))
    : null;

  const updateWorkoutInFirebase = () => {
    // const workoutFirebaseId = activeRoutine.workouts[adjustDateForSunday()];
    const workoutFirebaseId = suggestedWorkout.firebaseId;
    axios.put(
      `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}/${workoutFirebaseId}.json`,
      {
        title: suggestedWorkout.title,
        targetAreaCode: suggestedWorkout.targetAreaCode,
        secondaryTargetCode: suggestedWorkout.secondaryTargetCode,
        targetArea: suggestedWorkout.targetArea,
        secondaryTargetArea: suggestedWorkout.secondaryTargetArea,
        exercises,
      }
    );
  };

  const recordADifferentWorkoutBtn = (
    <button onClick={() => setShowModal(true)}>
      Record a different workout
    </button>
  );

  const switchWorkout = (workoutId) => {
    workoutId
      ? axios
          .get(
            `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}/${workoutId}.json`
          )
          .then((res) => {
            setSuggestedWorkout({ ...res.data, firebaseId: workoutId });
            dispatch(setExercises(res.data.exercises));
            if (error.code === 'noSelectedWorkout') setError(null);
          })
      : setError({
          msg: (
            <p style={{ color: 'red' }}>
              No Workout was selected. Please select a workout to record
            </p>
          ),
          code: 'noSelectedWorkout',
        });
  };

  const finalDisplay = (
    <>
      <h1>{today.toString().substring(0, 15)}</h1>
      {suggestedWorkout ? <h3>{suggestedWorkout.title}</h3> : <h3>Rest</h3>}
      {error ? error.msg : null}
      {displayExercises}
      {suggestedWorkout ? (
        <RecordWorkoutBtn
          workout={suggestedWorkout}
          exercises={exercises}
          date={today}
          history={props.history}
          updated={updated}
          updateWorkoutInFirebase={updateWorkoutInFirebase}
          userId={user.authUser.uid}
        />
      ) : null}
      {recordADifferentWorkoutBtn}

      <RecordADifferentWorkout
        userId={user.authUser.uid}
        show={showModal}
        closeModal={() => setShowModal(false)}
        switchWorkout={(workoutId) => switchWorkout(workoutId)}
      />
    </>
  );

  return loading ? <Spinner /> : finalDisplay;
};

export default RecordWorkout;
