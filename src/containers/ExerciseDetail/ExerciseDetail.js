import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ExerciseDetailCategory from '../../components/ExerciseDetails/ExerciseDetailCategory/ExerciseDetailCategory';
import ExerciseDetailEquipment from '../../components/ExerciseDetails/ExerciseDetailEquipment/ExerciseDetailEquipment';
import ExerciseDetailDescription from '../../components/ExerciseDetails/ExerciseDetailDescription/ExerciseDetailDescription';
import ExerciseDetailMuscles from '../../components/ExerciseDetails/ExerciseDetailMuscles/ExerciseDetailMuscles';
import ExericseDetailImg from '../../components/ExerciseDetails/ExerciseDetailImg/ExerciseDetailImg';
import AddToWorkoutBtn from '../../components/AddToWorkoutBtn/AddToWorkoutBtn';
import Modal from '../../components/UI/Modal/Modal';
import FavoriteBtn from '../../components/FavoriteBtn/FavoriteBtn';
import classes from './ExerciseDetail.module.css';
import { removeFromFavorites } from '../../store/actions';
import wgerDict from '../../shared/wgerDict';

const ExerciseDetail = (props) => {
  const [exercise, setExercise] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
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
  const { user, uid, accessToken } = useSelector((state) => state.auth);
  const favorites = useSelector((state) => state.favorites.favorites);
  const buildingWorkout = useSelector((state) => state.workout.buildingWorkout);
  const dispatch = useDispatch();

  useEffect(() => {
    if (exercise) document.title = exercise.name;
  }, [exercise]);

  useEffect(() => {
    const { firebaseSearchId, id } = props.location.state;

    const shouldLoadCustomExercises = props.location.state.custom && user;
    const url = shouldLoadCustomExercises
      ? `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${uid}/${firebaseSearchId}.json?auth=${accessToken}`
      : `https://wger.de/api/v2/exercise/${id}`;

    axios
      .get(url, { timeout: 10000 })
      .then((res) => setExercise(res.data))
      .catch((err) => {
        setError({ ...error, isError: true, code: 'noExercise' });
      });
  }, [props.location.state, uid, error, user, accessToken]);

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

    const { firebaseSearchId } = props.location.state;

    await axios({
      method: 'delete',
      url: `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${uid}/${firebaseSearchId}.json?auth=${accessToken}`,
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
      <div className={classes.ModalBtnWrapper}>
        <button
          className={`GlobalBtn-1 ${classes.ConfirmBtn}`}
          onClick={deleteCustomExercise}
        >
          Delete exercise
        </button>
        <button
          className={`GlobalBtn-1 ${classes.CancelBtn}`}
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );

  console.log(exercise);

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
      {exercise.description && (
        <ExerciseDetailDescription description={exercise.description} />
      )}

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
      <ExericseDetailImg
        primaryMuscles={exercise.muscles || []}
        secondaryMuscles={exercise.muscles_secondary || []}
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
        <div className={classes.AddToWorkoutBtnContainer}>
          <AddToWorkoutBtn
            history={props.history}
            id={exercise.id}
            name={exercise.name}
          />
        </div>
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
