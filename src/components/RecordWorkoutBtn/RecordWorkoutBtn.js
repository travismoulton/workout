import { useState } from 'react';
import axios from 'axios';

import Modal from '../UI/Modal/Modal';

const RecordWorkoutBtn = (props) => {
  const [showModal, setShowModal] = useState(false);

  const recordWorkoutHandler = () => {
    axios.post(
      `https://workout-81691-default-rtdb.firebaseio.com/recordedWorkouts/${props.userId}.json`,
      {
        exercises: props.exercises,
        title: props.workout.title,
        date: {
          year: props.date.getFullYear(),
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
    </>
  );
};

export default RecordWorkoutBtn;
