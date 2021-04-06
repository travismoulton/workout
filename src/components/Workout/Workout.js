import { useSelector, useDispatch } from 'react-redux';

import WorkoutListItem from '../../containers/WorkoutListItem/WorkoutListItem';

const Workout = (props) => {
  const { exercises } = useSelector((state) => state.workout);
  const dispatch = useDispatch();
  const { workout } = props.history.location.state;

  console.log(workout);

  const exercises2 = workout.exercises.map((exercise, i) => (
    <WorkoutListItem
      name={exercise.name}
      key={exercise.id}
      id={exercise.id}
      weight={exercise.weight}
      sets={exercise.sets}
      reps={exercise.reps}
      firstExercise={i === 0}
      lastExercise={i === exercise.length - 1}
    />
  ));

  return (
    <>
      <h1>{workout.title}</h1>
      <ul>{exercises}</ul>
    </>
  );
};

export default Workout;
