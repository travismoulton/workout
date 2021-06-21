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
          arr.push({ value: i * 5, label: (i * 5).toString() });
        return arr;
      })(),
    },
    get displayValue() {
      return this.elementConfig.options.filter(
        (option) => option.value === props.weight
      )[0];
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
        for (let i = 0; i < 25; i++)
          arr.push({ value: i, label: i.toString() });
        return arr;
      })(),
    },
    get displayValue() {
      return this.elementConfig.options.filter(
        (option) => option.value === props.reps
      )[0];
    },
    value: props.reps,
    label: 'Reps',
    id: 3,
  });

  const [minutesInput, setMinutesInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: (() => {
        let arr = [];
        for (let i = 0; i < 90; i++)
          arr.push({ value: i, label: i.toString() });
        return arr;
      })(),
    },
    get displayValue() {
      return this.elementConfig.options.filter(
        (option) => option.value === props.minutes
      )[0];
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
        for (let i = 0; i < 61; i++)
          arr.push({ value: i, label: i.toString() });
        return arr;
      })(),
    },
    get displayValue() {
      return this.elementConfig.options.filter(
        (option) => option.value === props.seconds
      )[0];
    },
    value: props.seconds,
    label: 'Seconds',
    id: 4,
  });

  const setWeight = (e) => {
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'weight',
        e.value * 1,
        props.setNumber - 1
      )
    );
  };

  const setNumReps = (e) => {
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'reps',
        e.value * 1,
        props.setNumber - 1
      )
    );
  };

  const setNumMinutes = (e) => {
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'minutes',
        e.value * 1,
        props.setNumber - 1
      )
    );
  };

  const setNumSeconds = (e) => {
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        'seconds',
        e.value * 1,
        props.setNumber - 1
      )
    );
  };

  const incrementWeight = () => {
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
    if (minutesInput.value > 0)
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
    if (secondsInput.value > 0)
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

  const btnFunctions =
    props.focus === 'reps'
      ? [
          [decrementWeight, incrementWeight],
          [decrementReps, incrementReps],
        ]
      : [
          [decrementMinutes, incrementMinutes],
          [decrementSeconds, incrementSeconds],
        ];

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
      value={field.displayValue}
      changed={updateFunctions[i]}
      label={field.label}
      classname="SetDetailsSelect"
      wrapperClass="SetDetailsSelectWrapper"
      setClipPath
      SetDetails
      decrementFunction={btnFunctions[i][0]}
      incrementFunction={btnFunctions[i][1]}
      notSearchable
    />
  ));

  const removeSetBtn = (
    <button
      className={`GlobalBtn-1 ${classes.Btn}`}
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
    <li className={classes.Set}>
      <p>Set # {props.setNumber}</p>
      <div className={classes.Form}>{form}</div>
      {props.numberOfSets > 1 && removeSetBtn}
    </li>
  );
};

export default SetDetails;
