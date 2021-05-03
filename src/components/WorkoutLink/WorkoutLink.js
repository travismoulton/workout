import { Link } from 'react-router-dom';
import { useState } from 'react';
import slugify from 'slugify';

import classes from './WorkoutLink.module.css';
import Modal from '../UI/Modal/Modal';

const WorkoutLink = (props) => {
  const [showModal, setShowModal] = useState(false);

  const modal = (
    <Modal show={showModal} modalClosed={() => setShowModal(false)}>
      <>
        <p>Are you sure you want to delete this workout?</p>
        {props.belongsToRoutine ? (
          <p>
            This workout belongs to a routine. If you delete it, it will be
            taken out of that routine. Do you wish to continue?
          </p>
        ) : null}
      </>
      <button onClick={() => setShowModal(false)}>No</button>
      <button
        onClick={
          props.belongsToRoutine
            ? props.deleteWorkoutAndRemove
            : props.deleteWorkout
        }
      >
        Yes
      </button>
    </Modal>
  );

  return (
    <>
      <div className={classes.Workout}>
        <div className={classes.TopRow}>
          <p>{props.title}</p>
        </div>
        <div className={classes.FlexRow}>
          {props.targetArea ? <p>Target Area: {props.targetArea}</p> : null}
          {props.secondaryTarget ? (
            <p>Secondary Target: {props.secondaryTarget}</p>
          ) : null}
          {props.exerciseCount ? (
            <p>Exercise Count: {props.exerciseCount}</p>
          ) : null}
        </div>
        <div className={classes.FlexRow}>
          <Link
            className={classes.WorkoutLink}
            to={{
              pathname: `/workout-detail/${slugify(props.title)}`,
              state: { workout: props.workout },
            }}
          >
            <button>Edit this workout</button>
          </Link>
          <button onClick={() => setShowModal(true)}>
            Delete this workout
          </button>
        </div>
      </div>
      {modal}
    </>
  );
};

export default WorkoutLink;
