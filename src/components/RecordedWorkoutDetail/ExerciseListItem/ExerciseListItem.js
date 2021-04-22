import classes from './ExerciseListItem.module.css';

const ExerciseListItem = (props) => (
  <li className={classes.ListItem}>
    <p>{props.title}</p>
    <div className={classes.DetailRow}>
      <p>Sets: {props.numSets}</p>
      <p>Reps: {props.numReps}</p>
      <p>Weight: {props.weight}</p>
    </div>
  </li>
);

export default ExerciseListItem;
