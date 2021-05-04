import { Link } from 'react-router-dom';

import classes from './RoutineLink.module.css';

const RoutineLink = (props) => {
  const deleteRoutineAndCloseModal = () => {
    props.toggleModal();
    props.deleteRoutine();
  };

  const displayModal = () => {
    props.setModalContent(
      <>
        <p>Are you sure you want to delete this routine?</p>
        <button onClick={props.toggleModal}>No</button>
        <button onClick={deleteRoutineAndCloseModal}>Yes</button>
      </>
    );
    props.toggleModal();
  };

  return (
    <div className={classes.Wrapper}>
      <div className={classes.TopRow}>{props.title}</div>
      <div>
        <p>Number of workouts: {props.numberOfWorkouts}</p>

        {props.isActiveRoutine ? (
          <p>This is your current routine</p>
        ) : (
          <button onClick={props.setActiveRoutine}>
            Set as current routine
          </button>
        )}

        <button onClick={displayModal}>Delete this routine</button>
        <Link
          to={{
            pathname: `/create-routine/${props.title}`,
            state: { routine: props.routine },
          }}
        >
          <button>Edit this routine</button>
        </Link>
      </div>
    </div>
  );
};

export default RoutineLink;
