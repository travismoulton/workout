import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import WorkoutLink from '../../components/WorkoutLink/WorkoutLink';
import RoutineLink from '../../components/RoutineLink/RoutineLink';
import classes from './UserProfile.module.css';
import { setActiveRoutine } from '../../store/actions/favorites';

const UserProfile = (props) => {
  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [routineDeleted, setRoutineDeleted] = useState(false);
  const [workoutDeleted, setWorkoutDeleted] = useState(false);
  const [workoutsShowing, setWorkoutsShowing] = useState(false);
  const [routinesShowing, setRoutinesShowing] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { activeRoutine } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  const fetchRoutines = useCallback(() => {
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
  }, [user.authUser.uid]);

  const fetchWorkouts = useCallback(() => {
    axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}.json`
      )
      .then((res) => {
        if (res.data) {
          const tempArr = [];
          for (const key in res.data)
            tempArr.push({ ...res.data[key], firebaseId: key });
          setWorkouts(tempArr);
        } else if (!res.data) {
          setWorkouts(['No workouts available']);
        }
      });
  }, [user.authUser.uid]);

  useEffect(() => {
    if (user && !workouts.length) fetchWorkouts();
  }, [user, workouts, fetchWorkouts]);

  useEffect(() => {
    if (user && !routines.length) fetchRoutines();
  }, [user, fetchRoutines, routines]);

  useEffect(() => {
    if (routineDeleted) {
      fetchRoutines();
      setRoutineDeleted(false);
    }
  }, [routineDeleted, fetchRoutines]);

  useEffect(() => {
    if (workoutDeleted) {
      fetchWorkouts();
      setWorkoutDeleted(false);
    }
  }, [workoutDeleted, fetchWorkouts]);

  const deleteWorkout = (firebaseId) => {
    axios
      .delete(
        `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}/${firebaseId}.json`
      )
      .then(() => setWorkoutDeleted(true));
  };

  const removeWorkoutFromAllRoutines = (firebaseId) => {
    const routinesToAlter = routines.filter((routine) =>
      routine.workouts.includes(firebaseId)
    );

    for (let i = 0; i < routinesToAlter.length; i++) {
      const updatedWorkouts = [...routinesToAlter[i].workouts];
      updatedWorkouts[updatedWorkouts.indexOf(firebaseId)] = 'Rest';

      axios.patch(
        `https://workout-81691-default-rtdb.firebaseio.com/routines/${user.authUser.uid}/${routinesToAlter[i].firebaseId}.json`,
        { workouts: updatedWorkouts }
      );
    }
  };

  // TODO: Need modal to warn about deleting related routines
  const deleteWorkoutHandler = (firebaseId) => {
    deleteWorkout(firebaseId);
    removeWorkoutFromAllRoutines(firebaseId);
  };

  const workoutLinks =
    workouts[0] !== 'No workouts available' ? (
      workouts.map((workout) => (
        <WorkoutLink
          key={workout.title}
          title={workout.title}
          targetArea={workout.targetArea}
          secondaryTarget={workout.secondaryTargetArea}
          exerciseCount={workout.exercises ? workout.exercises.length : null}
          workout={workout}
          belongsToRoutine={
            routines.filter((routine) =>
              routine.workouts.includes(workout.firebaseId)
            ).length > 0
          }
          deleteWorkoutAndRemove={() =>
            deleteWorkoutHandler(workout.firebaseId)
          }
          deleteWorkout={() => deleteWorkout(workout.firebaseId)}
        />
      ))
    ) : (
      <Link to="/create-workout">
        No workouts available, click here to create a workout
      </Link>
    );

  const changeActiveRoutine = (routine, firebaseId) => {
    // If there is a current active routine in firebase, set the active routine property to false
    if (activeRoutine.firebaseId) {
      axios.patch(
        `https://workout-81691-default-rtdb.firebaseio.com/routines/${user.authUser.uid}/${activeRoutine.firebaseId}.json`,
        {
          activeRoutine: false,
        }
      );
    }

    axios.patch(
      `https://workout-81691-default-rtdb.firebaseio.com/routines/${user.authUser.uid}/${firebaseId}.json`,
      { activeRoutine: true }
    );

    dispatch(setActiveRoutine({ ...routine, firebaseId }));
  };

  const deleteRoutine = (firebaseId) => {
    axios
      .delete(
        `https://workout-81691-default-rtdb.firebaseio.com/routines/${user.authUser.uid}/${firebaseId}.json`
      )
      .then(() => setRoutineDeleted(true));
  };

  const routineLinks =
    routines[0] !== 'No routines available' ? (
      routines.map((routine) => (
        <RoutineLink
          key={routine.title}
          workouts={routine.workouts}
          title={routine.title}
          setActiveRoutine={() =>
            changeActiveRoutine(routine, routine.firebaseId)
          }
          numberOfWorkouts={
            routine.workouts.filter((workout) => workout !== 'Rest').length
          }
          isActiveRoutine={
            activeRoutine
              ? routine.firebaseId === activeRoutine.firebaseId
              : false
          }
          deleteRoutine={() => deleteRoutine(routine.firebaseId)}
          routine={routine}
        />
      ))
    ) : (
      <Link to="/create-routine">
        No routines available, click here to create a routine
      </Link>
    );

  const triggerWorkoutsShowing = () => {
    setWorkoutsShowing(workoutsShowing ? false : true);
    if (routinesShowing) setRoutinesShowing(false);
  };

  const triggerRoutinesShowing = () => {
    setRoutinesShowing(routinesShowing ? false : true);
    if (workoutsShowing) setWorkoutsShowing(false);
  };

  return (
    <>
      <div className={classes.Workouts}>
        <span
          className={classes.SectionHeader}
          onClick={triggerWorkoutsShowing}
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
          onClick={triggerRoutinesShowing}
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
