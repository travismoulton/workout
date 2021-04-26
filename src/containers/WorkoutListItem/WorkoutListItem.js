import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import {
  changeExerciseOrder,
  removeExercise,
  addSetToExercise,
} from '../../store/actions';
import classes from './WorkoutListItem.module.css';
import SetDetails from '../SetDetails/SetDetails';

const WorkoutListItem = (props) => {
  const { exercises } = useSelector((state) => state.workout);
  const dispatch = useDispatch();

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
    dispatch(addSetToExercise(exercises, props.id));
  };

  const addSetBtn = <button onClick={addSet}>Add another set</button>;

  const sets = props.sets.length
    ? props.sets.map((s, i) => (
        <SetDetails
          key={uniqid()}
          reps={s.reps}
          weight={s.weight}
          id={props.id}
          setNumber={i + 1}
          numberOfSets={props.sets.length}
        />
      ))
    : null;

  return (
    <li className={classes.WorkoutListItem}>
      <div>{props.name}</div>
      {sets ? <ul style={{ listStyle: 'none' }}>{sets}</ul> : null}
      <div>
        {!props.firstExercise && !props.inRecordMode ? moveUpInOrderBtn : null}
        {!props.lastExercise && !props.inRecordMode ? moveDownInOrderBtn : null}
      </div>
      {closeWorkoutBtn}
      {addSetBtn}
    </li>
  );
};
export default WorkoutListItem;
