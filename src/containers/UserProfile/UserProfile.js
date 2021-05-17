import { useState, useEffect, useCallback } from 'react';

import Workouts from './Workouts/Workouts';
import Routines from './Routines/Routines';
import RecordedWorkouts from './RecordedWorkouts/RecordedWorkouts';

import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './UserProfile.module.css';

const UserProfile = (props) => {
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);
  const [workoutsFetched, setWorkoutsFetched] = useState(false);
  const [routinesFetched, setRoutinesFetched] = useState(false);
  const [recordedWorkoutsFetched, setRecordedWorkoutsFetched] = useState(false);
  const [workoutsShowing, setWorkoutsShowing] = useState(false);
  const [routinesShowing, setRoutinesShowing] = useState(false);
  const [recordedWorkoutsShowing, setRecordedWorkoutsShowing] = useState(false);
  const [showMessage, setShowMessage] = useState(null);
  const [messageFinished, setMessageFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    if (
      workoutsFetched &&
      routinesFetched &&
      recordedWorkoutsFetched &&
      !initialFetchCompleted
    )
      setInitialFetchCompleted(true);
  }, [
    initialFetchCompleted,
    workoutsFetched,
    recordedWorkoutsFetched,
    routinesFetched,
  ]);

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

  useEffect(() => {
    let timer;
    if (!showModal && modalContent)
      timer = setTimeout(() => {
        setModalContent(null);
      }, 500);

    return timer ? clearTimeout(timer) : null;
  }, [showModal, modalContent]);

  const display = (
    <>
      {showMessage}

      <Workouts
        setModalContent={(jsx) => setModalContent(jsx)}
        toggleModal={() => setShowModal((prevShowModal) => !prevShowModal)}
        triggerWorkoutsShowing={triggerWorkoutsShowing}
        showWorkouts={workoutsShowing}
        setFetchCompleted={() => setWorkoutsFetched(true)}
      />

      <Routines
        setModalContent={(jsx) => setModalContent(jsx)}
        toggleModal={() => setShowModal((prevShowModal) => !prevShowModal)}
        triggerRoutinesShowing={triggerRoutinesShowing}
        showRoutines={routinesShowing}
        setFetchCompleted={() => setRoutinesFetched(true)}
      />
      <RecordedWorkouts
        setModalContent={(jsx) => setModalContent(jsx)}
        toggleModal={() => setShowModal((prevShowModal) => !prevShowModal)}
        triggerRecordedWorkoutsShowing={triggerRecordedWorkoutsShowing}
        showRecordedWorkouts={recordedWorkoutsShowing}
        setFetchCompleted={() => setRecordedWorkoutsFetched(true)}
      />

      {modal}
    </>
  );

  // return initialFetchCompleted ? display : <Spinner />;
  return display;
};

export default UserProfile;
