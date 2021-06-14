import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs';

import RemoveExerciseBtn from './RemoveExerciseBtn/RemoveExerciseBtn';
import SetDetails from '../SetDetails/SetDetails';
import Input from '../../components/UI/Input/Input';
import {
  changeExerciseOrder,
  resetSetsToTimeFocus,
  resetSetsToRepsFocus,
  addSetToExercise,
  addTimeFocusedSetToExercise,
} from '../../store/actions';
import classes from './WorkoutListItem.module.css';

const WorkoutListItem = (props) => {
  const [exerciseFocus, setExerciseFocus] = useState(props.focus || 'reps');
  const { exercises } = useSelector((state) => state.workout);
  const dispatch = useDispatch();

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
      notSearchable
    />
  );

  const moveUpInOrderBtn = (
    <button
      className={`GlobalBtn-1 ${classes.OrderBtn}`}
      onClick={() => dispatch(changeExerciseOrder(exercises, props.id, 'up'))}
    >
      Move Exercise Up <BsArrowUpShort size="2em" color="#fff" />
    </button>
  );

  const moveDownInOrderBtn = (
    <button
      className={`GlobalBtn-1 ${classes.OrderBtn}`}
      onClick={() => dispatch(changeExerciseOrder(exercises, props.id, 'down'))}
    >
      Move Exercise Down <BsArrowDownShort size="2em" color="#fff" />
    </button>
  );

  const addSet = () => {
    exerciseFocus === 'reps'
      ? dispatch(addSetToExercise(exercises, props.id))
      : dispatch(addTimeFocusedSetToExercise(exercises, props.id));
  };

  const addSetBtn = (
    <button className={`GlobalBtn-1 ${classes.AddSetBtn}`} onClick={addSet}>
      Add another set
    </button>
  );

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
      <div className={classes.WorkoutTitle}>{props.name}</div>
      {focusSelectMenu}
      {sets && <ul className={classes.SetsWrapper}>{sets}</ul>}
      <div className={classes.BtnRow}>
        {!props.isFirstExercise && !props.inRecordMode && moveUpInOrderBtn}
        {addSetBtn}
        {!props.isLastExercise && !props.inRecordMode && moveDownInOrderBtn}
      </div>
      <RemoveExerciseBtn id={props.id} exerciseName={props.name} />
    </li>
  );
};
export default WorkoutListItem;
