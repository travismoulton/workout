import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ExerciseDetailCategory from '../../components/ExerciseDetails/ExerciseDetailCategory/ExerciseDetailCategory';
import ExerciseDetailEquipment from '../../components/ExerciseDetails/ExerciseDetailEquipment/ExerciseDetailEquipment';
import ExerciseDetailDescription from '../../components/ExerciseDetails/ExerciseDetailDescription/ExerciseDetailDescription';
import ExerciseDetailMuscles from '../../components/ExerciseDetails/ExerciseDetailMuscles/ExerciseDetailMuscles';
import classes from './ExerciseDetail.module.css';
import { addToFavorites, removeFromFavorites } from '../../store/actions';

const ExerciseDetail = (props) => {
  const [exercise, setExercise] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [description, setDescription] = useState('');
  const [firebaseId, setFirebaseId] = useState('');
  const user = useSelector((state) => state.auth.user);
  const wgerDict = useSelector((state) => state.wgerDict);
  const favorites = useSelector((state) => state.favorites.favorites);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`https://wger.de/api/v2/exercise/${props.location.state.id}`)
      .then((res) => setExercise(res.data));
  }, [props.location.state.id]);

  useEffect(() => {
    if (exercise) {
      const div = document.createElement('div');
      div.innerHTML = exercise.description;
      setDescription(div.textContent || div.innerText);
    }
  }, [exercise]);

  useEffect(() => {
    setIsFavorite(false);
    setFirebaseId('');

    if (exercise && favorites)
      favorites.forEach((fav) => {
        if (fav.exercise === exercise.id) {
          setIsFavorite(true);
          setFirebaseId(fav.firebaseId);
        }
      });
  }, [favorites, exercise]);

  console.log('render');

  const onSubmit = () =>
    isFavorite
      ? dispatch(removeFromFavorites(user.authUser.uid, firebaseId))
      : dispatch(addToFavorites(user.authUser.uid, exercise.id));

  const display = exercise ? (
    <div>
      <h3>{exercise.name}</h3>
      <ExerciseDetailCategory
        category={wgerDict.exerciseCategoryList[exercise.category]}
      />
      <ExerciseDetailEquipment
        equipment={exercise.equipment.map((el) => wgerDict.equipment[el])}
      />
      <ExerciseDetailDescription description={description} />
      <ExerciseDetailMuscles
        muscles={exercise.muscles.map((muscle) => wgerDict.muscles[muscle])}
        secondary={exercise.muscles_secondary.map(
          (muscle) => wgerDict.muscles[muscle]
        )}
      />
      <button
        className={isFavorite ? classes.Favorite : null}
        onClick={onSubmit}
      >
        Favorite
      </button>
    </div>
  ) : null;

  return <>{display}</>;
};

export default ExerciseDetail;
