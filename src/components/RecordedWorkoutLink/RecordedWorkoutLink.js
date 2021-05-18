import { Link } from 'react-router-dom';

import classes from './RecordedWorkoutLink.module.css';

const RecordedWorkoutLink = (props) => {
  const date = new Date(props.date.year, props.date.month, props.date.day);

  return (
    <>
      <div className={classes.Record}>
        <p>{props.title}</p>
        <p>{date.toString().substring(0, 15)}</p>
        <div className={classes.BtnRow}>
          <Link
            className={classes.Link}
            to={`/recorded-workout-detail/${props.firebaseId}`}
          >
            <button>View details</button>
          </Link>
          <button onClick={props.deleteRecordedWorkout}>
            Delete this record
          </button>
        </div>
      </div>
    </>
  );
};

export default RecordedWorkoutLink;
