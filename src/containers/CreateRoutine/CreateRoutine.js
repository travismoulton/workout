import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { updateObject, checkValidityHandler } from '../../shared/utility';
import Input from '../../components/UI/Input/Input';
import SubmitRoutineBtn from '../../components/SubmitRoutineBtn/SubmitRoutineBtn';

const CreateRoutine = (props) => {
  const [historyUsed, setHistoryUsed] = useState(false);
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
    valid: false,
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
  const [formIsValid, setFormIsValid] = useState(false);
  const [firebaseId, setFirebaseId] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [isActiveRoutine, setIsActiveRoutine] = useState(false);

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

  useEffect(() => {
    if (props.history.location.state && !historyUsed) {
      const { routine } = props.history.location.state;

      if (routine) {
        setSelectedWorkouts(routine.workouts);
        setRoutineNameInput({ ...routineNameInput, value: routine.title });
        setOriginalTitle(routine.title);
        setFirebaseId(routine.firebaseId);
        setHistoryUsed(true);
        setFormIsValid(true);
        setIsActiveRoutine(routine.activeRoutine);
      }
    }
  }, [
    props.history.location.state,
    historyUsed,
    selectedWorkouts,
    routineNameInput,
    formIsValid,
    firebaseId,
  ]);

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

  const inputChangedHandler = (e, input) => {
    const updatedInput = updateObject(input, {
      value: e.target.value,
      valid: checkValidityHandler(e.target.value, input.validation),
      touched: true,
    });

    updatedInput.valid ? setFormIsValid(true) : setFormIsValid(false);

    setRoutineNameInput(updatedInput);
  };

  // Preventing submission of a routine that has no workouts.
  const checkForWorkouts = () => {
    let hasWorkout = false;

    selectedWorkouts.forEach((workout) => {
      if (workout !== 'Rest') hasWorkout = true;
    });

    return hasWorkout;
  };

  console.log(isActiveRoutine);

  const display = (
    <>
      <Input
        elementType={routineNameInput.elementType}
        elementConfig={routineNameInput.elementConfig}
        value={routineNameInput.value}
        changed={(e) => inputChangedHandler(e, routineNameInput)}
      />
      {workoutSelectMenus}
      <SubmitRoutineBtn
        userId={user.authUser.uid}
        title={routineNameInput.value}
        workouts={selectedWorkouts}
        history={props.history}
        valid={formIsValid}
        containsWorkout={() => checkForWorkouts()}
        createNewRoutine={firebaseId === ''}
        firebaseId={firebaseId}
        isActiveRoutine={isActiveRoutine}
        titleChanged={routineNameInput.touched}
        originalTitleEntact={originalTitle === routineNameInput.value}
      />
    </>
  );

  return workoutSelectMenu.elementConfig.options.length ? display : null;
};

export default CreateRoutine;
