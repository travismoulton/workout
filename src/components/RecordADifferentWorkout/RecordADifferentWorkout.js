import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Modal from '../UI/Modal/Modal';
import Input from '../UI/Input/Input';
import classes from './RecordADifferentWorkout.module.css';

const RecordADifferentWorkout = (props) => {
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [routineWorkouts, setRoutineWorkouts] = useState([]);
  const [initialRoutineMenuSet, setIntialRoutineMenuSet] = useState(false);
  const [initalWorkoutMenuSet, setInitialWorkoutMenuSet] = useState(false);
  const [activeRoutineSelectMenu, setActiveRoutineSelectMenu] = useState({
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
  const [allWorkoutSelectMenu, setAllWorkoutSelectMenu] = useState({
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
    if (activeRoutine) {
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
    }
  }, [activeRoutine, props.userId]);

  useEffect(() => {
    fetchRoutineWorkouts();
    fetchAllWorkouts();
  }, [fetchRoutineWorkouts, fetchAllWorkouts]);

  useEffect(() => {
    if (routineWorkouts.length && !initialRoutineMenuSet) {
      const menuOptions = routineWorkouts.map((workout) => ({
        value: workout.firebaseId,
        displayValue: workout.title,
      }));
      setActiveRoutineSelectMenu({
        ...activeRoutineSelectMenu,
        elementConfig: {
          ...activeRoutineSelectMenu.elementConfig,
          options: [{ value: '', displayValue: '' }, ...menuOptions],
        },
      });
      setIntialRoutineMenuSet(true);
    }
  }, [routineWorkouts, initialRoutineMenuSet, activeRoutineSelectMenu]);

  useEffect(() => {
    if (allWorkouts.length && !initalWorkoutMenuSet) {
      const menuOptions = allWorkouts.map((workout) => ({
        value: workout.firebaseId,
        displayValue: workout.title,
      }));
      setAllWorkoutSelectMenu({
        ...allWorkoutSelectMenu,
        elementConfig: {
          ...allWorkoutSelectMenu.elementConfig,
          options: [{ value: '', displayValue: '' }, ...menuOptions],
        },
      });
      setInitialWorkoutMenuSet(true);
    }
  }, [allWorkouts, initalWorkoutMenuSet, allWorkoutSelectMenu]);

  const routineBasedInput = (
    <Input
      label={'Choose from active routine'}
      value={activeRoutineSelectMenu.value}
      elementConfig={activeRoutineSelectMenu.elementConfig}
      elementType={activeRoutineSelectMenu.elementType}
      changed={(e) =>
        setActiveRoutineSelectMenu({
          ...activeRoutineSelectMenu,
          value: e.target.value,
        })
      }
    />
  );

  const workoutBasedInput = (
    <Input
      label={'Choose from all your workouts'}
      value={allWorkoutSelectMenu.value}
      elementConfig={allWorkoutSelectMenu.elementConfig}
      elementType={allWorkoutSelectMenu.elementType}
      changed={(e) =>
        setAllWorkoutSelectMenu({
          ...allWorkoutSelectMenu,
          value: e.target.value,
        })
      }
    />
  );

  const switchWorkoutAndCloseModal = (menu) => {
    if (menu === 'routine') {
      props.switchWorkout(activeRoutineSelectMenu.value);
      setActiveRoutineSelectMenu({ ...activeRoutineSelectMenu, value: '' });
    } else if (menu === 'allWorkouts') {
      props.switchWorkout(allWorkoutSelectMenu.value);
      setAllWorkoutSelectMenu({ ...allWorkoutSelectMenu, value: '' });
    }
    props.closeModal();
  };

  const switchWorkoutBtn = (menu) => (
    <button onClick={() => switchWorkoutAndCloseModal(menu)}>
      Choose workout
    </button>
  );

  const noAvailableWorkoutsMsg = (
    <p>
      You have no workouts available. Go to &nbsp;
      <Link to="/create-workout">Create Workout</Link> To make one now
    </p>
  );

  const modal = (
    <Modal show={props.show} modalClosed={() => props.closeModal()}>
      {activeRoutineSelectMenu.elementConfig.options.length ? (
        <div className={classes.MenuGrouping}>
          {routineBasedInput}
          {switchWorkoutBtn('routine')}
        </div>
      ) : null}
      {allWorkoutSelectMenu.elementConfig.options.length ? (
        <div className={classes.MenuGrouping}>
          {workoutBasedInput}
          {switchWorkoutBtn('allWorkouts')}
        </div>
      ) : null}
      {!activeRoutineSelectMenu.elementConfig.options.length &&
      !allWorkoutSelectMenu.elementConfig.options.length
        ? noAvailableWorkoutsMsg
        : null}
      <button onClick={props.closeModal}>Cancel</button>
    </Modal>
  );

  return <>{modal}</>;
};

export default RecordADifferentWorkout;
