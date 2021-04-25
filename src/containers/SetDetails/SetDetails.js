import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import classes from './SetDetails.module.css';
import { updateExerciseData } from '../../store/actions';
import Input from '../../components/UI/Input/Input';

const SetDetails = (props) => {
  const { exercises } = useSelector((state) => state.workout);
  const dispatch = useDispatch();

  const [weightInput, setWeightInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: (() => {
        let arr = [];
        for (let i = 0; i < 75; i++)
          arr.push({ value: i * 5, displayValue: i * 5 });
        return arr;
      })(),
    },
    value: props.weight,
    label: 'Weight',
    id: 1,
  });

  const [repsInput, setRepsInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: (() => {
        let arr = [];
        for (let i = 1; i < 25; i++) arr.push({ value: i, displayValue: i });
        return arr;
      })(),
    },
    value: props.reps,
    label: 'Number of reps',
    id: 3,
  });

  const setWeight = (e) => {
    setWeightInput({ ...weightInput, value: e.target.value * 1 });
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'weight',
        e.target.value * 1,
        props.setNumber - 1
      )
    );
  };

  const setNumReps = (e) => {
    setRepsInput({ ...repsInput, value: e.target.value * 1 });
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'reps',
        e.target.value * 1,
        props.setNumber - 1
      )
    );
  };

  const incrementWeight = () => {
    setWeightInput({ ...weightInput, value: weightInput.value + 5 });
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'weight',
        weightInput.value + 5,
        props.setNumber - 1
      )
    );
  };

  const decrementWeight = () => {
    if (weightInput.value > 0) {
      setWeightInput({ ...weightInput, value: weightInput.value - 5 });
      dispatch(
        updateExerciseData(
          exercises,
          props.id,
          'weight',
          weightInput.value - 5,
          props.setNumber - 1
        )
      );
    }
  };

  const incremementReps = () => {
    setRepsInput({ ...repsInput, value: repsInput.value + 1 });
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'reps',
        repsInput.value + 1,
        props.setNumber - 1
      )
    );
  };

  const decrementReps = () => {
    if (repsInput.value > 0) {
      setRepsInput({ ...repsInput, value: repsInput.value - 1 });
      dispatch(
        updateExerciseData(
          exercises,
          props.id,
          'reps',
          repsInput.value - 1,
          props.setNumber - 1
        )
      );
    }
  };

  const formFields = [weightInput, repsInput];
  const updateFunctions = [setWeight, setNumReps];

  const form = formFields.map((field, i) => (
    <Input
      elementType={field.elementType}
      elementConfig={field.elementConfig}
      key={field.id}
      value={field.value}
      changed={updateFunctions[i]}
      label={field.label}
      classname="WorkoutListItem"
    />
  ));

  const btnRow = (
    <div className={classes.ButtonRow}>
      <span className={classes.ButtonPair}>
        <button className={classes.DecrementBtn} onClick={decrementWeight}>
          -
        </button>
        <button className={classes.IncrementBtn} onClick={incrementWeight}>
          +
        </button>
      </span>
      <span className={classes.ButtonPair}>
        <button className={classes.DecrementBtn} onClick={decrementReps}>
          -
        </button>
        <button className={classes.IncrementBtn} onClick={incremementReps}>
          +
        </button>
      </span>
    </div>
  );

  return (
    <li>
      <p>Set # {props.setNumber}</p>
      <div className={classes.Form}>{form}</div>
      {btnRow}
    </li>
  );
};

export default SetDetails;
