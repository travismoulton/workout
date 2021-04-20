import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import Modal from '../UI/Modal/Modal';
import Input from '../UI/Input/Input';

const RecordADifferentWorkout = (props) => {
  const [showModal, setShowModal] = useState(props.show);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [routineWorkouts, setRoutineWorkouts] = useState([]);
  const [workoutSelectMenu, setWorkoutSelectMenu] = useState({
    elementType: 'select',
    elementConfig: {
      options: [],
    },
    value: '',
    validation: {
      required: false,
    },
    valid: true,
  });
  const { activeRoutine } = useSelector((state) => state.favorites);

  const fetchAllWorkouts = useCallback(() => {
    axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/workouts/${props.userId}.json`
      )
      .then((res) => {
        if (res.data) {
          const tempArr = [];
          for (const key in res.data)
            tempArr.push({ ...res.data[key], firebaseId: key });
          setAllWorkouts(tempArr);
        } else if (!res.data) {
          setAllWorkouts([]);
        }
      });
  }, [props.userId]);

  const fetchRoutineWorkouts = useCallback(() => {
    const workoutIds = activeRoutine.workouts.filter(
      (workout) => workout !== 'Rest'
    );

    const tempArr = [];

    for (let i = 0; i < workoutIds.length; i++) {
      axios
        .get(
          `https://workout-81691-default-rtdb.firebaseio.com/workouts/${props.userId}/${workoutIds[i]}.json`
        )
        .then((res) => {
          tempArr.push(res.data);
        });
    }

    setRoutineWorkouts(tempArr);
  }, [activeRoutine.workouts, props.userId]);

  useEffect(() => {
    fetchRoutineWorkouts();
    fetchAllWorkouts();
  }, [fetchRoutineWorkouts, fetchAllWorkouts]);

  const modal = (
    <Modal show={showModal} modalClosed={() => setShowModal(false)}></Modal>
  );

  return <>{modal}</>;
};

export default RecordADifferentWorkout;
