import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import RoutineLink from '../../../components/RoutineLink/RoutineLink';
import classes from './Routines.module.css';
import { setRoutines, setActiveRoutine } from '../../../store/actions';

const Routines = (props) => {
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);
  const [routineDeleted, setRoutineDeleted] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { routines } = useSelector((state) => state.userProfile);
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
          dispatch(setRoutines(tempArr));
        } else if (!res.data) {
          // dispatch(setRoutines([]));
        }
      });
  }, [user.authUser.uid, dispatch]);

  useEffect(() => {
    if (!initialFetchCompleted) {
      fetchRoutines();
      setInitialFetchCompleted();
    }
  }, [initialFetchCompleted, fetchRoutines]);

  useEffect(() => {
    if (routineDeleted) {
      fetchRoutines();
      setRoutineDeleted(false);
    }
  }, [routineDeleted, fetchRoutines]);

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

  const routineLinks = routines ? (
    routines.map((routine) => (
      <RoutineLink
        key={routine.title}
        workouts={routine.workouts}
        title={routine.title}
        setActiveRoutine={() =>
          changeActiveRoutine(routine, routine.firebaseId)
        }
        numberOfWorkouts={
          routine.workouts
            ? routine.workouts.filter((workout) => workout !== 'Rest').length
            : 0
        }
        isActiveRoutine={
          activeRoutine
            ? routine.firebaseId === activeRoutine.firebaseId
            : false
        }
        deleteRoutine={() => deleteRoutine(routine.firebaseId)}
        routine={routine}
        setModalContent={(jsx) => props.setModalContent(jsx)}
        toggleModal={props.toggleModal}
      />
    ))
  ) : (
    <Link to="/create-routine">
      No routines available, click here to create a routine
    </Link>
  );

  return (
    <div className={classes.Routines}>
      <span
        className={classes.SectionHeader}
        onClick={props.triggerRoutinesShowing}
      >
        <h3>My Routines</h3>
        <div
          className={
            props.showRoutines ? classes.ArrowDown : classes.ArrowRight
          }
        ></div>
      </span>
      {props.showRoutines && routineLinks}
    </div>
  );
};

export default Routines;
