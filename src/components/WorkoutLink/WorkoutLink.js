import { Link } from 'react-router-dom';

import classes from './WorkoutLink.module.css';

const WorkoutLink = (props) => (
  <Link
    className={classes.WorkoutLink}
    to={{
      pathname: `/workout-detail/${props.title}`,
      state: { workout: props.workout },
    }}
  >
    <div className={classes.TopRow}>
      <p>{props.title}</p>
    </div>
    <div className={classes.BottomRow}>
      {props.targetArea ? <p>Target Area: {props.targetArea}</p> : null}
      {props.secondaryTarget ? (
        <p>Secondary Target: {props.secondaryTarget}</p>
      ) : null}
      {props.exerciseCount ? (
        <p>Exercise Count: {props.exerciseCount}</p>
      ) : null}
    </div>
  </Link>
);

export default WorkoutLink;
