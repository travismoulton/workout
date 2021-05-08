import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import SetDetails from '../SetDetails/SetDetails';
import Input from '../../components/UI/Input/Input';
import {
  changeExerciseOrder,
  removeExercise,
  resetSetsToTimeFocus,
  resetSetsToRepsFocus,
  addSetToExercise,
  addTimeFocusedSetToExercise,
} from '../../store/actions';
import classes from './WorkoutListItem.module.css';

const WorkoutListItem = (props) => {
  const [exerciseFocus, setExerciseFocus] = useState('reps');
  const { exercises } = useSelector((state) => state.workout);
  const dispatch = useDispatch();

  const [exerciseFocusInput, setExerciseFocusInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: [
        { value: 'reps', displayValue: 'Reps' },
        { value: 'time', displayValue: 'Time' },
      ],
    },
    value: 'reps',
    label: 'Exercise focus: ',
    id: 1,
  });

  const changeFocusHandler = (e) => {
    setExerciseFocusInput({ ...exerciseFocusInput, value: e.target.value });
    setExerciseFocus(e.target.value);

    e.target.value === 'time'
      ? dispatch(resetSetsToTimeFocus(exercises, props.id))
      : dispatch(resetSetsToRepsFocus(exercises, props.id));
  };

  const focusSelectMenu = (
    <Input
      elementConfig={exerciseFocusInput.elementConfig}
      elementType={exerciseFocusInput.elementType}
      changed={changeFocusHandler}
      label={exerciseFocusInput.label}
    />
  );

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

  const addSet = () => {
    exerciseFocus === 'reps'
      ? dispatch(addSetToExercise(exercises, props.id))
      : dispatch(addTimeFocusedSetToExercise(exercises, props.id));
  };

  const addSetBtn = <button onClick={addSet}>Add another set</button>;

  const sets = props.sets.length
    ? props.sets.map((set, i) => (
        <SetDetails
          key={uniqid()}
          reps={set.reps}
          weight={set.weight}
          minutes={set.minutes}
          seconds={set.seconds}
          focus={exerciseFocus}
          id={props.id}
          setNumber={i + 1}
          numberOfSets={props.sets.length}
        />
      ))
    : null;

  return (
    <li className={classes.WorkoutListItem}>
      <div>{props.name}</div>
      {focusSelectMenu}
      {sets ? <ul style={{ listStyle: 'none' }}>{sets}</ul> : null}
      <div>
        {!props.isFirstExercise && !props.inRecordMode
          ? moveUpInOrderBtn
          : null}
        {!props.isLastExercise && !props.inRecordMode
          ? moveDownInOrderBtn
          : null}
      </div>
      {closeWorkoutBtn}
      {addSetBtn}
    </li>
  );
};
export default WorkoutListItem;
