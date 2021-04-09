import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeExerciseOrder,
  removeExercise,
  updateExerciseData,
} from '../../store/actions';
import classes from './WorkoutListItem.module.css';
import Input from '../../components/UI/Input/Input';

const WorkoutListItem = (props) => {
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

  const [setsInput, setSetsInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: (() => {
        let arr = [];
        for (let i = 1; i < 25; i++) arr.push({ value: i, displayValue: i });
        return arr;
      })(),
    },
    value: props.sets,
    label: 'Number of sets',
    id: 2,
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
      updateExerciseData(exercises, props.id, 'weight', e.target.value * 1)
    );
  };

  const setNumSets = (e) => {
    setSetsInput({ ...setsInput, value: e.target.value * 1 });
    dispatch(
      updateExerciseData(exercises, props.id, 'sets', e.target.value * 1)
    );
  };

  const setNumReps = (e) => {
    setRepsInput({ ...repsInput, value: e.target.value * 1 });
    dispatch(
      updateExerciseData(exercises, props.id, 'reps', e.target.value * 1)
    );
  };

  const formFields = [weightInput, setsInput, repsInput];
  const updateFunctions = [setWeight, setNumSets, setNumReps];

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

  const closeWorkoutBtn = (
    <div
      className={classes.CloseWorkoutBtn}
      onClick={() => dispatch(removeExercise(exercises, props.id))}
    >
      &times;
    </div>
  );

  const moveUpInOrderBtn = (
    <button
      onClick={() => dispatch(changeExerciseOrder(exercises, props.id, 'up'))}
    >
      Up
    </button>
  );

  const moveDownInOrderBtn = (
    <button
      onClick={() => dispatch(changeExerciseOrder(exercises, props.id, 'down'))}
    >
      Down
    </button>
  );

  return (
    <li className={classes.WorkoutListItem}>
      <div>{props.name}</div>
      <div className={classes.Form}>{form}</div>
      <div>
        {!props.firstExercise ? moveUpInOrderBtn : null}
        {!props.lastExercise ? moveDownInOrderBtn : null}
      </div>
      {closeWorkoutBtn}
    </li>
  );
};
export default WorkoutListItem;