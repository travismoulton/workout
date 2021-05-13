import { useState } from 'react';
import axios from 'axios';

import Modal from '../UI/Modal/Modal';

const RecordWorkoutBtn = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [axiosError, setAxiosError] = useState({
    isError: null,
    message: (
      <p style={{ color: 'red' }}>
        We're having trouble recording your workout. Please try again
      </p>
    ),
  });

  const recordWorkoutHandler = async () => {
    axios({
      method: 'post',
      url: `https://workout-81691-default-rtdb.firebaseio.com/recordedWorkouts/${props.userId}.json`,
      timeout: 5000,
      data: {
        exercises: props.exercises,
        title: props.workout.title,
        date: {
          year: props.date.getFullYear(),
          month: props.date.getMonth(),
          day: props.date.getDate(),
        },
      },
    })
      .then(() => {
        props.history.push({
          pathname: '/my-profile',
          state: { message: 'Workout Recorded' },
        });
      })
      .catch((err) => setAxiosError({ ...axiosError, isError: true }));
  };

  const closeModalAndSaveWorkout = () => {
    setShowModal(false);
    props.updateWorkoutInFirebase();
    recordWorkoutHandler();
  };

  const closeModalWithoutSavingWorkout = () => {
    setShowModal(false);
    recordWorkoutHandler();
  };

  const modal = (
    <Modal show={showModal} modalClosed={() => setShowModal(false)}>
      <p>
        You made changes to this workout. Would you like to make theses changes
        permanant?
      </p>
      <button onClick={() => setShowModal(false)}>Go back</button>
      <button onClick={closeModalWithoutSavingWorkout}>No</button>
      <button onClick={closeModalAndSaveWorkout}>Yes</button>
    </Modal>
  );
  return (
    <>
      {modal}
      <button
        onClick={
          props.updated ? () => setShowModal(true) : recordWorkoutHandler
        }
      >
        Record workout
      </button>
      {axiosError.isError ? axiosError.message : null}
    </>
  );
};

export default RecordWorkoutBtn;
