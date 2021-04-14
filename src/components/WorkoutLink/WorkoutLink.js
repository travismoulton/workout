import { Link } from 'react-router-dom';

import classes from './WorkoutLink.module.css';

const WorkoutLink = (props) => (
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
    <div className={classes.FlexRox}>
      <Link
        className={classes.WorkoutLink}
        to={{
          pathname: `/workout-detail/${props.title}`,
          state: { workout: props.workout },
        }}
      >
        <button>Edit this workout</button>
      </Link>
      <button onClick={props.deleteWorkout}>Delete this workout</button>
    </div>
  </div>
);

export default WorkoutLink;
