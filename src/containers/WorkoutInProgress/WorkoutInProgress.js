import WorkoutListItem from '../WorkoutListItem/WorkoutListItem';
import classes from './WorkoutInProgress.module.css';

const WorkoutInProgress = (props) => {
  const exercies = props.exercises.map((exercise) => (
    <WorkoutListItem name={exercise.name} />
  ));
  return (
    <div>
      <h3>{props.name}</h3>
      <ul className={classes.WorkoutList}>{exercies}</ul>
    </div>
  );
};

export default WorkoutInProgress;
