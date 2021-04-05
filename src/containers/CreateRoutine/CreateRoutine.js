import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../components/UI/Input/Input';

const CreateRoutine = () => {
  const [selectedWorkouts, setSelectedWorkouts] = useState([
    'Rest',
    'Rest',
    'Rest',
    'Rest',
    'Rest',
    'Rest',
    'Rest',
  ]);
  const [routineNameInput, setRoutineNameInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Routine name',
    },
    value: '',
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    id: 'routineName',
  });
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

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && !workoutSelectMenu.elementConfig.options.length)
      axios
        .get(
          `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}.json`
        )
        .then((res) => {
          const userWorkouts = [{ displayValue: 'Rest', value: 'Rest' }];

          for (const key in res.data)
            userWorkouts.push({
              displayValue: res.data[key].title,
              value: key,
            });

          setWorkoutSelectMenu({
            ...workoutSelectMenu,
            elementConfig: {
              ...workoutSelectMenu.elementConfig,
              options: userWorkouts,
            },
          });
        });
  }, [user, workoutSelectMenu]);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const workoutSelectMenus = days.map((day, i) => {
    const select = { ...workoutSelectMenu, value: selectedWorkouts[i] };
    const changed = (e) => {
      const tempWorkouts = [...selectedWorkouts];
      tempWorkouts[i] = e.target.value;
      setSelectedWorkouts(tempWorkouts);
    };
    return (
      <Input
        elementType={select.elementType}
        elementConfig={select.elementConfig}
        value={select.value}
        changed={(e) => changed(e)}
        label={day}
        key={day}
      />
    );
  });

  const submitRoutine = () => {
    axios.post(
      `https://workout-81691-default-rtdb.firebaseio.com/routines/${user.authUser.uid}.json`,
      {
        title: routineNameInput.value,
        workouts: selectedWorkouts,
      }
    );
  };

  const submitRoutineBtn = (
    <button onClick={submitRoutine}>Create Routine</button>
  );

  const display = (
    <>
      <Input
        elementType={routineNameInput.elementType}
        elementConfig={routineNameInput.elementConfig}
        value={routineNameInput.value}
        changed={(e) =>
          setRoutineNameInput({ ...routineNameInput, value: e.target.value })
        }
      />
      {workoutSelectMenus}
      {submitRoutineBtn}
    </>
  );

  return workoutSelectMenu.elementConfig.options.length ? display : null;
};

export default CreateRoutine;
