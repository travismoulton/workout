import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import WorkoutLink from '../../components/WorkoutLink/WorkoutLink';
import RoutineLink from '../../components/RoutineLink/RoutineLink';
import classes from './UserProfile.module.css';
import { setActiveRoutine } from '../../store/actions/favorites';

const UserProfile = (props) => {
  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [workoutsShowing, setWorkoutsShowing] = useState(false);
  const [routinesShowing, setRoutinesShowing] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { activeRoutine } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

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
            for (const key in res.data)
              tempArr.push({ ...res.data[key], firebaseId: key });
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

  const setActiveRoutine = (firebaseId, routine) => {
    axios.patch(
      `https://workout-81691-default-rtdb.firebaseio.com/routines/${user.authUser.uid}/${activeRoutine.firebaseId}.json`,
      {
        activeRoutine: false,
      }
    );

    axios.patch(
      `https://workout-81691-default-rtdb.firebaseio.com/routines/${user.authUser.uid}/${firebaseId}.json`,
      { activeRoutine: true }
    );

    dispatch(setActiveRoutine({ ...routine, firebaseId }));
  };

  const routineLinks =
    routines[0] !== 'No routines available' ? (
      routines.map((routine) => (
        <RoutineLink
          key={routine.title}
          workouts={routine.workouts}
          title={routine.title}
          setActiveRoutine={() => setActiveRoutine(routine.firebaseId)}
          numberOfWorkouts={
            routine.workouts.filter((workout) => workout !== 'Rest').length
          }
        />
      ))
    ) : (
      <Link to="/create-routine">
        No routines available, click here to create a routine
      </Link>
    );

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
      <div className={classes.Routines}>
        <span
          className={classes.SectionHeader}
          onClick={() => setRoutinesShowing(routinesShowing ? false : true)}
        >
          <h3>My Routines</h3>
          <div
            className={routinesShowing ? classes.ArrowDown : classes.ArrowRight}
          ></div>
        </span>
        {routinesShowing ? routineLinks : null}
      </div>
    </>
  );
};
export default UserProfile;
