import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import WorkoutListItem from '../WorkoutListItem/WorkoutListItem';
import RecordWorkoutBtn from './RecordWorkoutBtn/RecordWorkoutBtn';
import { setExercises, resetWorkoutStore } from '../../store/actions';

const RecordWorkout = (props) => {
  const [today] = useState(new Date());
  const [suggestedWorkout, setSuggestedWorkout] = useState(null);
  const [exercisesDispatched, setExercisesDispatched] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { activeRoutine } = useSelector((state) => state.favorites);
  const { exercises } = useSelector((state) => state.workout);
  const { updated } = useSelector((state) => state.workout);
  const dispatch = useDispatch();

  const adjustDateForSunday = useCallback(() => {
    return today.getDay() === 0 ? 6 : today.getDay() - 1;
  }, [today]);

  useEffect(() => {
    if (!suggestedWorkout && activeRoutine) {
      const workoutFirebaseId = activeRoutine.workouts[adjustDateForSunday()];

      (async () =>
        await axios
          .get(
            `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}/${workoutFirebaseId}.json`
          )
          .then((res) => setSuggestedWorkout(res.data)))();
    }
  }, [suggestedWorkout, adjustDateForSunday, activeRoutine, user.authUser.uid]);

  useEffect(() => {
    if (suggestedWorkout && !exercisesDispatched) {
      dispatch(setExercises(suggestedWorkout.exercises));
      setExercisesDispatched(true);
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

  useEffect(() => {
    const unlisten = props.history.listen((location, action) => {
      dispatch(resetWorkoutStore());
      unlisten();
    });
  });

  const displayExercises = suggestedWorkout
    ? suggestedWorkout.exercises.map((exercise, i) => (
        <WorkoutListItem
          name={exercise.name}
          key={exercise.id}
          id={exercise.id}
          weight={exercise.weight}
          sets={exercise.sets}
          reps={exercise.reps}
          inRecordMode={true}
        />
      ))
    : null;

  const updateWorkoutInFirebase = () => {
    const workoutFirebaseId = activeRoutine.workouts[adjustDateForSunday()];
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

  return (
    <>
      <h1>{today.toString().substring(0, 15)}</h1>
      {suggestedWorkout ? <h3>{suggestedWorkout.title}</h3> : <h3>Rest</h3>}
      {displayExercises}
      <RecordWorkoutBtn
        workout={suggestedWorkout}
        exercises={exercises}
        date={today}
        history={props.history}
        updated={updated}
        updateWorkoutInFirebase={updateWorkoutInFirebase}
        userId={user.authUser.uid}
      />
    </>
  );
};

export default RecordWorkout;
