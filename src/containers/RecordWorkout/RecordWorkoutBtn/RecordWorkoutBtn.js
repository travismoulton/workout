import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

const RecordWorkoutBtn = (props) => {
  const { user } = useSelector((state) => state.auth);

  const recordWorkoutHandler = () => {
    axios.post(
      `https://workout-81691-default-rtdb.firebaseio.com/recordedWorkouts/${user.authUser.uid}.json`,
      {
        exercises: props.workout.exercises,
        title: props.workout.title,
        date: {
          year: props.date.getYear(),
          month: props.date.getMonth(),
          day: props.date.getDate(),
        },
      }
    );
    props.history.push({
      pathname: '/my-profile',
      state: { message: 'Workout Recorded' },
    });
  };

  return <button onClick={recordWorkoutHandler}>Record workout</button>;
};

export default RecordWorkoutBtn;
