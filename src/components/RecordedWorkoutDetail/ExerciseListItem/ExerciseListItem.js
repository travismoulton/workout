import uniqid from 'uniqid';

import classes from './ExerciseListItem.module.css';
import SetLevelDetails from './SetLevelDetail/SetLevelDetail';

const ExerciseListItem = (props) => {
  const setDetails = props.sets.map((set, i) => (
    <SetLevelDetails
      index={i + 1}
      reps={set.reps}
      weight={set.weight}
      minutes={set.minutes}
      seconds={set.seconds}
      key={uniqid()}
    />
  ));
  return (
    <li className={classes.ListItem}>
      <p>{props.title}</p>
      <div className={classes.DetailRow}>
        <ul className={classes.SetDetails}>{setDetails}</ul>
      </div>
    </li>
  );
};
export default ExerciseListItem;
