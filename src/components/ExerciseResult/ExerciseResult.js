import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import slugify from 'slugify';

import AddToWorkoutBtn from '../AddToWorkoutBtn/AddToWorkoutBtn';
import { addToFavorites, removeFromFavorites } from '../../store/actions/';
import classes from './ExerciseResult.module.css';

const ExerciseResult = (props) => {
  const user = useSelector((state) => state.auth.user);
  const buildingWorkout = useSelector((state) => state.workout.buildingWorkout);
  const dispatch = useDispatch();

  const onSubmit = () =>
    props.isFavorite
      ? dispatch(removeFromFavorites(user.authUser.uid, props.firebaseId))
      : dispatch(addToFavorites(user.authUser.uid, props.exerciseId));

  const btn = (
    <button
      className={props.isFavorite ? classes.favorite : null}
      onClick={onSubmit}
    >
      Favorite
    </button>
  );

  return (
    <li className={classes.ExerciseResult}>
      <div className={classes.Mb1}>
        <Link
          to={{
            pathname: `/exercise/${slugify(props.name)}`,
            state: {
              id: props.exerciseId,
            },
          }}
        >
          {props.name}
        </Link>
        {user ? btn : null}
        {buildingWorkout ? (
          <AddToWorkoutBtn
            name={props.name}
            id={props.exerciseId}
            history={props.history}
          />
        ) : null}
      </div>
      <div>
        <span>{props.category}</span>
        <span>{props.equipment}</span>
      </div>
    </li>
  );
};

export default ExerciseResult;
