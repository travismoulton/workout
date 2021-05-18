import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import RoutineLink from '../../../components/RoutineLink/RoutineLink';
import '../UserProfile.css';
import {
  setRoutines,
  setActiveRoutine,
  toggleRoutineRefresh,
} from '../../../store/actions';

const Routines = (props) => {
  const [randomState, setRandomState] = useState(false);
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);
  const [routineDeleted, setRoutineDeleted] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { routines, refreshRoutines } = useSelector(
    (state) => state.userProfile
  );
  const { activeRoutine } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  const fetchRoutines = useCallback(() => {
    axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/routines/${user.authUser.uid}.json`,
        { timeout: 5000 }
      )
      .then((res) => {
        if (res.data) {
          const tempArr = [];
          for (const key in res.data)
            tempArr.push({ ...res.data[key], firebaseId: key });
          dispatch(setRoutines(tempArr));
        } else if (!res.data) {
          dispatch(setRoutines(null));
        }
      })
      .catch((err) => {
        props.toggleError();
      });
  }, [user.authUser.uid, dispatch, props]);

  useEffect(() => {
    if (!initialFetchCompleted && !props.isError) {
      fetchRoutines();
      setInitialFetchCompleted();
      props.setFetchCompleted();
    }
  }, [initialFetchCompleted, fetchRoutines, props]);

  useEffect(() => {
    if (refreshRoutines) {
      fetchRoutines();
      dispatch(toggleRoutineRefresh());
      setRandomState(true);
    }
  }, [randomState, refreshRoutines, dispatch, fetchRoutines]);

  useEffect(() => {
    if (routineDeleted) {
      fetchRoutines();
      setRoutineDeleted(false);
    }
  }, [routineDeleted, fetchRoutines]);

  const changeActiveRoutine = (routine, firebaseId) => {
    // If there is a current active routine in firebase, set the active routine property to false
    if (activeRoutine.firebaseId) {
      axios({
        method: 'patch',
        url: `https://workout-81691-default-rtdb.firebaseio.com/routines/${user.authUser.uid}/${activeRoutine.firebaseId}.json`,
        timeout: 5000,
        data: { activeRoutine: false },
      }).catch((err) => {
        props.toggleError();
      });
    }

    axios({
      method: 'patch',
      url: `https://workout-81691-default-rtdb.firebaseio.com/routines/${user.authUser.uid}/${firebaseId}.json`,
      timeout: 5000,
      data: { activeRoutine: true },
    }).catch((err) => {
      props.toggleError();
    });

    dispatch(setActiveRoutine({ ...routine, firebaseId }));
  };

  const deleteRoutine = (firebaseId) => {
    axios
      .delete(
        `https://workout-81691-default-rtdb.firebaseio.com/routines/${user.authUser.uid}/${firebaseId}.json`,
        { timeout: 5000 }
      )
      .then(() => setRoutineDeleted(true))
      .catch((err) => {
        props.toggleError();
      });
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
    <div className="Routines">
      <span className="SectionHeader" onClick={props.triggerRoutinesShowing}>
        <h3>My Routines</h3>
        <div className={props.showRoutines ? 'ArrowDown' : 'ArrowRight'}></div>
      </span>
      {props.showRoutines && routineLinks}
    </div>
  );
};

export default Routines;
