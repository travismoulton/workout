import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import WorkoutListItem from '../WorkoutListItem/WorkoutListItem';
import RecordWorkoutBtn from './RecordWorkoutBtn/RecordWorkoutBtn';
import { setExercises } from '../../store/actions';

const RecordWorkout = (props) => {
  const [today, setToday] = useState(new Date());
  const [suggestedWorkout, setSuggestedWorkout] = useState(null);
  const [exercisesDispatched, setExercisesDispatched] = useState(false);
  const [lastRecordedWorkout, setLastRecordedWorkout] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { activeRoutine } = useSelector((state) => state.favorites);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

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

  useEffect(() => {
    if (!lastRecordedWorkout)
      axios
        .get(
          `https://workout-81691-default-rtdb.firebaseio.com/recordedWorkouts/${user.authUser.uid}.json`
        )
        .then((res) => {
          if (res.data)
            setLastRecordedWorkout(
              res.data[Object.keys(res.data)[Object.keys(res.data).length - 1]]
            );
        });
  }, [lastRecordedWorkout, user.authUser.uid]);

  useEffect(() => {
    if (lastRecordedWorkout) {
      const { date } = lastRecordedWorkout;
      const dayOfWorkout = new Date(date.year, date.month, date.day).getDay();
      console.log(days[adjustDateForSunday(dayOfWorkout)]);
      const today = days[adjustDateForSunday(new Date().getDay)];

      console.log(activeRoutine.workouts[adjustDateForSunday(dayOfWorkout)]);
    }
  });

  const exercises = suggestedWorkout
    ? suggestedWorkout.exercises.map((exercise, i) => (
        <WorkoutListItem
          name={exercise.name}
          key={exercise.id}
          id={exercise.id}
          weight={exercise.weight}
          sets={exercise.sets}
          reps={exercise.reps}
          firstExercise={i === 0}
          lastExercise={i === suggestedWorkout.exercises.length - 1}
          inRecordMode={true}
        />
      ))
    : null;

  return (
    <>
      <h1>{today.toString().substring(0, 15)}</h1>
      {suggestedWorkout ? <h3>{suggestedWorkout.title}</h3> : null}
      {exercises}
      <RecordWorkoutBtn
        workout={suggestedWorkout}
        date={today}
        history={props.history}
      />
    </>
  );
};

export default RecordWorkout;
