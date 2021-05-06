import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import classes from './SetDetails.module.css';
import { updateExerciseData, removeSetFromExercise } from '../../store/actions';
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

  const [minutesInput, setMinutesInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: (() => {
        let arr = [];
        for (let i = 1; i < 90; i++) arr.push({ value: i, displayValue: i });
        return arr;
      })(),
    },
    value: props.minutes,
    label: 'Minutes: ',
    id: 3,
  });

  const [secondsInput, setSecondsInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: (() => {
        let arr = [];
        for (let i = 1; i < 61; i++) arr.push({ value: i, displayValue: i });
        return arr;
      })(),
    },
    value: props.seconds,
    label: 'Seconds',
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

  const setNumMinutes = (e) => {
    setRepsInput({ ...minutesInput, value: e.target.value * 1 });
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'minutes',
        e.target.value * 1,
        props.setNumber - 1
      )
    );
  };

  const setNumSeconds = (e) => {
    setRepsInput({ ...secondsInput, value: e.target.value * 1 });
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'seconds',
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

  const incrementReps = () => {
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

  const incrementMinutes = () => {
    setRepsInput({ ...minutesInput, value: minutesInput.value + 1 });
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'minutes',
        minutesInput.value + 1,
        props.setNumber - 1
      )
    );
  };

  const decrementMinutes = () => {
    setRepsInput({ ...minutesInput, value: minutesInput.value - 1 });
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'minutes',
        minutesInput.value - 1,
        props.setNumber - 1
      )
    );
  };

  const incrementSeconds = () => {
    setRepsInput({ ...secondsInput, value: secondsInput.value + 1 });
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'seconds',
        secondsInput.value + 1,
        props.setNumber - 1
      )
    );
  };

  const decrementSeconds = () => {
    setRepsInput({ ...secondsInput, value: secondsInput.value - 1 });
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'seconds',
        secondsInput.value - 1,
        props.setNumber - 1
      )
    );
  };

  const formFields =
    props.focus === 'reps'
      ? [weightInput, repsInput]
      : [minutesInput, secondsInput];

  const updateFunctions =
    props.focus === 'reps'
      ? [setWeight, setNumReps]
      : [setNumMinutes, setNumSeconds];

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
        <button
          className={classes.DecrementBtn}
          onClick={props.focus === 'reps' ? decrementWeight : decrementMinutes}
        >
          -
        </button>
        <button
          className={classes.IncrementBtn}
          onClick={props.focus === 'reps' ? incrementWeight : incrementMinutes}
        >
          +
        </button>
      </span>
      <span className={classes.ButtonPair}>
        <button
          className={classes.DecrementBtn}
          onClick={props.focus === 'reps' ? decrementReps : decrementSeconds}
        >
          -
        </button>
        <button
          className={classes.IncrementBtn}
          onClick={props.focus === 'reps' ? incrementReps : incrementSeconds}
        >
          +
        </button>
      </span>
    </div>
  );

  const removeSetBtn = (
    <button
      onClick={() =>
        dispatch(
          removeSetFromExercise(exercises, props.id, props.setNumber - 1)
        )
      }
    >
      Remove set
    </button>
  );

  return (
    <li>
      <p>Set # {props.setNumber}</p>
      <div className={classes.Form}>{form}</div>
      {btnRow}
      {props.numberOfSets > 1 ? removeSetBtn : null}
    </li>
  );
};

export default SetDetails;
