import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import ExerciseResult from '../../components/ExerciseResult/ExerciseResult';

const CustomResults = (props) => {
  const [exercises, setExercises] = useState([]);
  const [favoriteExerciseIds, setFavoriteExerciseIds] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  const wgerDict = useSelector((state) => state.wgerDict);

  useEffect(() => {
    if (!exercises.length)
      (async () => {
        await axios
          .get(
            `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${user.authUser.uid}.json`
          )
          .then((res) => {
            const exerciseArr = [];
            for (const key in res.data) {
              exerciseArr.push({ ...res.data[key], firebaseId: key });
            }
            setExercises(exerciseArr);
          });
      })();
  }, [exercises, user.authUser.uid]);

  useEffect(() => {
    if (favorites)
      setFavoriteExerciseIds(favorites.map((favorite) => favorite.exercise));
  }, [favorites]);

  const getFirebaseId = (exercise) =>
    favoriteExerciseIds.includes(exercise.id) &&
    favorites.length === favoriteExerciseIds.length
      ? favorites.filter((favorite) => favorite.exercise === exercise.id)[0]
          .firebaseId
      : null;

  const displayResults = exercises.map((exercise) => (
    <ExerciseResult
      history={props.history}
      key={exercise.name}
      name={exercise.name}
      category={
        exercise.category
          ? wgerDict.exerciseCategoryList[exercise.category]
          : []
      }
      equipment={
        exercise.equipment ? wgerDict.equipment[exercise.equipment[0]] : []
      }
      isFavorite={favoriteExerciseIds.includes(exercise.id)}
      firebaseId={getFirebaseId(exercise)}
      firebaseSearchId={exercise.firebaseId}
      exerciseId={exercise.id}
      custom={true}
    />
  ));

  return exercises.length ? <ul>{displayResults}</ul> : null;
};

export default CustomResults;
