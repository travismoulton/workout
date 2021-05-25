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
  console.log('render');

  const [exerciseFocusInput, setExerciseFocusInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: [
        { value: 'reps', label: 'Reps' },
        { value: 'time', label: 'Time' },
      ],
    },
    value: 'reps',
    label: 'Exercise focus: ',
    id: 1,
  });

  const changeFocusHandler = (e) => {
    setExerciseFocusInput({ ...exerciseFocusInput, value: e.value });
    setExerciseFocus(e.value);

    e.value === 'time'
      ? dispatch(resetSetsToTimeFocus(exercises, props.id))
      : dispatch(resetSetsToRepsFocus(exercises, props.id));
  };

  const focusSelectMenu = (
    <Input
      elementConfig={exerciseFocusInput.elementConfig}
      elementType={exerciseFocusInput.elementType}
      changed={changeFocusHandler}
      label={exerciseFocusInput.label}
      classname={'ExerciseFocusSelect'}
      wrapperClass={'ExerciseFocusSelectWrapper'}
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

  const sets =
    props.sets.length &&
    props.sets.map((set, i) => (
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
    ));

  return (
    <li className={classes.WorkoutListItem}>
      <div>{props.name}</div>
      {focusSelectMenu}
      {sets && <ul className={classes.SetsWrapper}>{sets}</ul>}
      <div>
        {!props.isFirstExercise && !props.inRecordMode && moveUpInOrderBtn}
        {!props.isLastExercise && !props.inRecordMode && moveDownInOrderBtn}
      </div>
      {closeWorkoutBtn}
      {addSetBtn}
    </li>
  );
};
export default WorkoutListItem;
