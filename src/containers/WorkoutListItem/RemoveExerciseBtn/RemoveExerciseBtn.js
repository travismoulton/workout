import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import Tooltip from '../../../components/UI/Tooltip/Tooltip';
import { removeExercise } from '../../../store/actions';
import classes from './RemoveExerciseBtn.module.css';

const RemoveWorkoutBtn = (props) => {
  const { exercises } = useSelector((state) => state.workout);
  const dispatch = useDispatch();

  return (
    <div
      className={classes.CloseWorkoutBtnContainer}
      onClick={() => dispatch(removeExercise(exercises, props.id))}
    >
      <AiOutlineCloseCircle className={classes.CloseWorkoutBtn} size="1.5em" />
    </div>
  );
};

export default RemoveWorkoutBtn;
