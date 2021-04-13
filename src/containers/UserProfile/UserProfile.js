import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from 'axios';

import WorkoutLink from '../../components/WorkoutLink/WorkoutLink';
import classes from './UserProfile.module.css';

const UserProfile = () => {
  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [workoutsShowing, setWorkoutsShowing] = useState(false);
  const [routinesShowing, setRoutinesShowing] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && !workouts.length)
      axios
        .get(
          `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}.json`
        )
        .then((res) => {
          if (res.data) {
            const tempArr = [];
            for (const key in res.data) tempArr.push(res.data[key]);
            setWorkouts(tempArr);
          } else if (!res.data) {
            setWorkouts(['No workouts available']);
          }
        });
  }, [user, workouts]);

  useEffect(() => {
    if (user && !routines.length)
      axios
        .get(
          `https://workout-81691-default-rtdb.firebaseio.com/routines/${user.authUser.uid}.json`
        )
        .then((res) => {
          if (res.data) {
            const tempArr = [];
            for (const key in res.data) tempArr.push(res.data[key]);
            setRoutines(tempArr);
          } else if (!res.data) {
            setRoutines(['No routines available']);
          }
        });
  }, [user, routines]);

  const workoutLinks = workouts.map((workout) => (
    <WorkoutLink
      key={workout.title}
      title={workout.title}
      targetArea={workout.targetArea}
      secondaryTarget={workout.secondaryTargetArea}
      exerciseCount={workout.exercises ? workout.exercises.length : null}
      workout={workout}
    />
  ));

  return (
    <>
      <div className={classes.Workouts}>
        <span
          className={classes.SectionHeader}
          onClick={() => setWorkoutsShowing(workoutsShowing ? false : true)}
        >
          <h3>My Workouts</h3>
          <div
            className={workoutsShowing ? classes.ArrowDown : classes.ArrowRight}
          ></div>
        </span>
        {workoutsShowing ? workoutLinks : null}
      </div>
    </>
  );
};
export default UserProfile;
