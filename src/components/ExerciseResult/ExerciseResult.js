import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import slugify from 'slugify';

import AddToWorkoutBtn from '../AddToWorkoutBtn/AddToWorkoutBtn';
import FavoriteBtn from '../FavoriteBtn/FavoriteBtn';
import classes from './ExerciseResult.module.css';

const ExerciseResult = (props) => {
  const user = useSelector((state) => state.auth.user);
  const buildingWorkout = useSelector((state) => state.workout.buildingWorkout);

  return (
    <li className={classes.ExerciseResult}>
      <div style={{ marginBottom: '0.5rem' }}>
        <Link
          to={{
            pathname: `/exercise/${slugify(props.name)}`,
            state: {
              id: props.exerciseId,
              firebaseSearchId: props.firebaseSearchId,
              custom: props.custom,
            },
          }}
        >
          <span style={{ marginRight: '.5rem' }}>Name:</span> {props.name}
        </Link>
        <div className={classes.BtnPairContainer}>
          {user && (
            <FavoriteBtn
              isFavorite={props.isFavorite}
              firebaseId={props.firebaseId}
              exerciseId={props.exerciseId}
              exerciseCategory={props.category}
            />
          )}
          {buildingWorkout && (
            <AddToWorkoutBtn
              name={props.name}
              id={props.exerciseId}
              history={props.history}
            />
          )}
        </div>
      </div>
      <div>
        <span>{props.category && `Category: ${props.category}`}</span>
        <span>{props.equipment && `Equipment: ${props.equipment}`}</span>
      </div>
    </li>
  );
};

export default ExerciseResult;
