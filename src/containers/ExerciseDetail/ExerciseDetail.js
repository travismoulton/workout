import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ExerciseDetailCategory from '../../components/ExerciseDetails/ExerciseDetailCategory/ExerciseDetailCategory';
import ExerciseDetailEquipment from '../../components/ExerciseDetails/ExerciseDetailEquipment/ExerciseDetailEquipment';
import ExerciseDetailDescription from '../../components/ExerciseDetails/ExerciseDetailDescription/ExerciseDetailDescription';
import ExerciseDetailMuscles from '../../components/ExerciseDetails/ExerciseDetailMuscles/ExerciseDetailMuscles';
import AddToWorkoutBtn from '../../components/AddToWorkoutBtn/AddToWorkoutBtn';
import Modal from '../../components/UI/Modal/Modal';
import FavoriteBtn from '../../components/FavoriteBtn/FavoriteBtn';
import classes from './ExerciseDetail.module.css';
import { removeFromFavorites } from '../../store/actions';
import wgerDict from '../../shared/wgerDict';

const ExerciseDetail = (props) => {
  const [exercise, setExercise] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [description, setDescription] = useState('');
  const [firebaseId, setFirebaseId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        We're having trouble loading this page right now. Please refresh the
        page or try again later
      </p>
    ),
    code: '',
  });
  const user = useSelector((state) => state.auth.user);
  const favorites = useSelector((state) => state.favorites.favorites);
  const buildingWorkout = useSelector((state) => state.workout.buildingWorkout);
  const dispatch = useDispatch();

  useEffect(() => {
    const shouldLoadCustomExercises = props.location.state.custom && user;
    const url = shouldLoadCustomExercises
      ? `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${user.authUser.uid}/${props.location.state.firebaseSearchId}.json`
      : `https://wger.de/api/v2/exercise/${props.location.state.id}`;

    axios
      .get(url, { timeout: 5000 })
      .then((res) => setExercise(res.data))
      .catch((err) => {
        setError({ ...error, isError: true, code: 'noExercise' });
      });
  }, [props.location.state, user, error]);

  useEffect(() => {
    if (exercise) {
      const div = document.createElement('div');
      div.innerHTML = exercise.description;
      // Strips out html tags from the API response
      setDescription(div.textContent || div.innerText);
    }
  }, [exercise]);

  useEffect(() => {
    setIsFavorite(false);
    setFirebaseId('');

    if (exercise && favorites)
      favorites.forEach((favorite) => {
        if (favorite.exercise === exercise.id) {
          setIsFavorite(true);
          setFirebaseId(favorite.firebaseId);
        }
      });
  }, [favorites, exercise]);

  const deleteCustomExercise = async () => {
    if (isFavorite)
      dispatch(removeFromFavorites(user.authUser.uid, props.firebaseId));

    await axios({
      method: 'delete',
      url: `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${user.authUser.uid}/${props.location.state.firebaseSearchId}.json`,
      timeout: 5000,
    }).catch((err) => {
      setError({ ...error, isError: true, code: 'delete' });
    });

    setShowModal(false);

    props.history.push('/search');
  };

  const deleteCustomExerciseBtn = (
    <button
      className={`GlobalBtn-1 ${classes.DeleteBtn}`}
      onClick={() => setShowModal(true)}
    >
      Delete exercise
    </button>
  );

  const modal = (
    <Modal show={showModal} modalClosed={() => setShowModal(false)}>
      <p>Are you sure you want to delete this exercise?</p>
      <button onClick={() => setShowModal(false)}>Cancel</button>
      <button onClick={deleteCustomExercise}>Delete exercise</button>
    </Modal>
  );

  const display = exercise && (
    <>
      {error.code === 'delete' && error.message}

      <h1 className={classes.ExerciseName}>{exercise.name}</h1>
      <ExerciseDetailCategory
        category={wgerDict.exerciseCategoryList[exercise.category]}
      />
      <ExerciseDetailEquipment
        equipment={
          exercise.equipment
            ? exercise.equipment.map((el) => wgerDict.equipment[el])
            : []
        }
      />
      <ExerciseDetailDescription description={description} />
      <ExerciseDetailMuscles
        muscles={
          exercise.muscles
            ? exercise.muscles.map((muscle) => wgerDict.muscles[muscle])
            : []
        }
        secondary={
          exercise.muscles_secondary
            ? exercise.muscles_secondary.map(
                (muscle) => wgerDict.muscles[muscle]
              )
            : []
        }
      />
      {user && (
        <div className={classes.BtnContainer}>
          <FavoriteBtn
            isFavorite={isFavorite}
            firebaseId={firebaseId}
            exerciseId={exercise.id}
          />
        </div>
      )}
      {buildingWorkout && (
        <AddToWorkoutBtn
          history={props.history}
          id={exercise.id}
          name={exercise.name}
        />
      )}
      {props.location.state.custom ? deleteCustomExerciseBtn : null}

      {props.location.state.custom ? modal : null}
    </>
  );

  const noExerciseError = error.code === 'noExercise' && error.message;

  return exercise
    ? display
    : error.code === 'noExercise'
    ? noExerciseError
    : null;
};

export default ExerciseDetail;
