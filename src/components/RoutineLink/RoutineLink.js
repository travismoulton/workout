import { Link } from 'react-router-dom';

import classes from './RoutineLink.module.css';

const RoutineLink = (props) => {
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
        <button onClick={props.deleteRoutine}>Delete this routine</button>
      </div>
    </div>
  );
};

export default RoutineLink;
