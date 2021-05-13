import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import uniqid from 'uniqid';

import ExerciseListItem from './ExerciseListItem/ExerciseListItem';

const RecordedWorkoutDetail = (props) => {
  const [axiosError, setAxiosError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        We're having trouble loading your workout. Please refresh the page or
        try again later
      </p>
    ),
  });
  const [workout, setWorkout] = useState(null);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!workout) {
      const { pathname } = props.location;
      const firebaseId = pathname.substring(pathname.lastIndexOf('/') + 1);

      (async () =>
        await axios
          .get(
            `https://workout-81691-default-rtdb.firebaseio.com/recordedWorkouts/${user.authUser.uid}/${firebaseId}.json`,
            { timeout: 5000 }
          )
          .then((res) => {
            setWorkout(res.data);
          })
          .catch((err) => {
            setAxiosError({ ...axiosError, isError: true });
          }))();
    }
  }, [workout, user.authUser.uid, props.location, axiosError]);

  const exercises = workout
    ? workout.exercises.map((exercise) => (
        <ExerciseListItem
          title={exercise.name}
          sets={exercise.sets}
          key={uniqid()}
        />
      ))
    : null;

  const display = workout ? (
    <>
      <h3>{workout.title}</h3>
      <p>
        {new Date(workout.date.year, workout.date.month, workout.date.day)
          .toString()
          .substring(0, 15)}
      </p>
      {exercises ? (
        <ul style={{ listStyle: 'none', padding: '0' }}>{exercises}</ul>
      ) : null}
    </>
  ) : null;

  return axiosError.isError ? axiosError.message : display;
};

export default RecordedWorkoutDetail;
