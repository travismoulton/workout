import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import WorkoutListItem from '../WorkoutListItem/WorkoutListItem';

const RecordWorkout = () => {
  const [today, setToday] = useState(new Date());
  const { user } = useSelector((state) => state.auth);
  const { activeRoutine } = useSelector((state) => state.favorites);
  const [suggestedWorkout, setSuggestedWorkout] = useState(null);

  const adjustDateForSunday = useCallback(() => {
    return today.getDay() === 0 ? 6 : today.getDay() - 1;
  }, [today]);

  console.log(adjustDateForSunday());

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
        />
      ))
    : null;

  return (
    <>
      <h1>{today.toString().substring(0, 15)}</h1>
      {suggestedWorkout ? <h3>{suggestedWorkout.title}</h3> : null}
      {exercises}
    </>
  );
};

export default RecordWorkout;
