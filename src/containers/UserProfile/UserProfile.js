import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import WorkoutLink from '../../components/WorkoutLink/WorkoutLink';
import RoutineLink from '../../components/RoutineLink/RoutineLink';
import RecordedWorkoutLink from '../../components/RecordedWorkoutLink/RecordedWorkoutLink';
import Modal from '../../components/UI/Modal/Modal';
import classes from './UserProfile.module.css';
import { setActiveRoutine } from '../../store/actions/favorites';

const UserProfile = (props) => {
  const [initialFetch, setInitialFetch] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [recordedWorkouts, setRecordedWorkouts] = useState([]);
  const [routineDeleted, setRoutineDeleted] = useState(false);
  const [workoutDeleted, setWorkoutDeleted] = useState(false);
  const [workoutsShowing, setWorkoutsShowing] = useState(false);
  const [routinesShowing, setRoutinesShowing] = useState(false);
  const [recordedWorkoutsShowing, setRecordedWorkoutsShowing] = useState(false);
  const [showMessage, setShowMessage] = useState(null);
  const [messageFinished, setMessageFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalDeleteFunction, setModalDeleteFunction] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { activeRoutine } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.history.location.state && !messageFinished && !showMessage) {
      const { message } = props.history.location.state;
      setShowMessage(<p className={classes.Message}>{message}</p>);
    }
  }, [showMessage, messageFinished, props.history.location.state]);

  useEffect(() => {
    let timer;
    if (showMessage) {
      timer = setTimeout(() => {
        setShowMessage(null);
        setMessageFinished(true);
      }, 2000);
    }

    return timer ? () => clearTimeout(timer) : null;
  }, [showMessage]);

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
          setRoutines([]);
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
          setWorkouts([]);
        }
      });
  }, [user.authUser.uid]);

  const fetchRecordedWorkouts = useCallback(() => {
    axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/recordedWorkouts/${user.authUser.uid}.json`
      )
      .then((res) => {
        if (res.data) {
          const tempArr = [];
          for (const key in res.data) {
            tempArr.push({ ...res.data[key], firebaseId: key });
          }
          setRecordedWorkouts(tempArr.reverse());
        } else if (!res.data) {
          setRecordedWorkouts([]);
        }
      });
  }, [user.authUser.uid]);

  useEffect(() => {
    if (user && !initialFetch) {
      fetchWorkouts();
      fetchRoutines();
      fetchRecordedWorkouts();
      setInitialFetch(true);
    }
  }, [initialFetch, user, fetchRecordedWorkouts, fetchWorkouts, fetchRoutines]);

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

  const deleteWorkoutHandler = (firebaseId) => {
    deleteWorkout(firebaseId);
    removeWorkoutFromAllRoutines(firebaseId);
  };

  const checkIfWorkoutBelongsToRoutine = (firebaseId) =>
    routines.filter((routine) => routine.workouts.includes(firebaseId)).length >
    0;

  const workoutLinks = workouts.length ? (
    workouts.map((workout) => (
      <WorkoutLink
        key={workout.title}
        title={workout.title}
        targetArea={workout.targetArea}
        secondaryTarget={workout.secondaryTargetArea}
        exerciseCount={workout.exercises ? workout.exercises.length : null}
        workout={workout}
        belongsToRoutine={checkIfWorkoutBelongsToRoutine(workout.firebaseId)}
        deleteWorkoutAndRemove={() => deleteWorkoutHandler(workout.firebaseId)}
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

  const routineLinks = routines.length ? (
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
        setModalContent={(text) => setModalContent(text)}
        toggleModal={() => setShowModal((prevModal) => !prevModal)}
      />
    ))
  ) : (
    <Link to="/create-routine">
      No routines available, click here to create a routine
    </Link>
  );

  const recordedWorkoutLinks = recordedWorkouts.length
    ? recordedWorkouts.map((record) => (
        <RecordedWorkoutLink
          key={record.firebaseId}
          title={record.title}
          date={record.date}
          firebaseId={record.firebaseId}
        />
      ))
    : null;

  const triggerWorkoutsShowing = () => {
    setWorkoutsShowing(workoutsShowing ? false : true);
    if (routinesShowing) setRoutinesShowing(false);
    if (recordedWorkoutsShowing) setRecordedWorkoutsShowing(false);
  };

  const triggerRoutinesShowing = () => {
    setRoutinesShowing(routinesShowing ? false : true);
    if (workoutsShowing) setWorkoutsShowing(false);
    if (recordedWorkoutsShowing) setRecordedWorkoutsShowing(false);
  };

  const triggerRecordedWorkoutsShowing = () => {
    setRecordedWorkoutsShowing(recordedWorkoutsShowing ? false : true);
    if (workoutsShowing) setWorkoutsShowing(false);
    if (routinesShowing) setRoutinesShowing(false);
  };

  const modal = (
    <Modal show={showModal} modalClosed={() => setShowModal(false)}>
      {modalContent}
    </Modal>
  );

  return (
    <>
      {showMessage}
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
      <div className={classes.RecordedWorkouts}>
        <span
          className={classes.SectionHeader}
          onClick={triggerRecordedWorkoutsShowing}
        >
          <h3>My Recorded Workouts</h3>
          <div
            className={
              recordedWorkoutsShowing ? classes.ArrowDown : classes.ArrowRight
            }
          ></div>
        </span>
        {recordedWorkoutsShowing ? recordedWorkoutLinks : null}
      </div>
      {modal}
    </>
  );
};
export default UserProfile;
