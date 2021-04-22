import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import Modal from '../UI/Modal/Modal';
import Input from '../UI/Input/Input';

const RecordADifferentWorkout = (props) => {
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [routineWorkouts, setRoutineWorkouts] = useState([]);
  const [initialMenuSet, setInitialMenuSet] = useState(false);
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

  const fetchRoutineWorkouts = useCallback(async () => {
    const workoutIds = activeRoutine.workouts.filter(
      (workout) => workout !== 'Rest'
    );

    const tempArr = [];

    for (let i = 0; i < workoutIds.length; i++) {
      await axios
        .get(
          `https://workout-81691-default-rtdb.firebaseio.com/workouts/${props.userId}/${workoutIds[i]}.json`
        )
        .then((res) => {
          tempArr.push({ ...res.data, firebaseId: workoutIds[i] });
        });
    }

    setRoutineWorkouts(tempArr);
  }, [activeRoutine.workouts, props.userId]);

  useEffect(() => {
    fetchRoutineWorkouts();
    fetchAllWorkouts();
  }, [fetchRoutineWorkouts, fetchAllWorkouts]);

  useEffect(() => {
    if (routineWorkouts.length && !initialMenuSet) {
      const menuOptions = routineWorkouts.map((workout) => ({
        value: workout.firebaseId,
        displayValue: workout.title,
      }));
      console.log('wtf');
      console.log(routineWorkouts, menuOptions);
      setWorkoutSelectMenu({
        ...workoutSelectMenu,
        elementConfig: {
          ...workoutSelectMenu.elementConfig,
          options: menuOptions,
        },
      });
      setInitialMenuSet(true);
    }
  }, [routineWorkouts, initialMenuSet, workoutSelectMenu]);

  const input = (
    <Input
      value={workoutSelectMenu.value}
      elementConfig={workoutSelectMenu.elementConfig}
      elementType={workoutSelectMenu.elementType}
      changed={(e) =>
        setWorkoutSelectMenu({ ...workoutSelectMenu, value: e.target.value })
      }
    />
  );

  const modal = (
    <Modal show={props.show} modalClosed={() => props.closeModal()}>
      {input}
    </Modal>
  );

  return <>{modal}</>;
};

export default RecordADifferentWorkout;
