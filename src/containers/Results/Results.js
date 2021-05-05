import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import ExerciseResult from '../../components/ExerciseResult/ExerciseResult';
import wgerDict from '../../shared/wgerDict';

const Results = (props) => {
  const [exercises, setExercises] = useState([]);
  const [favoriteExerciseIds, setFavoriteExerciseIds] = useState([]);
  const { favorites } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (props.location.state.wger && !exercises.length) {
      const param =
        props.location.state.category === 'exercisecategory'
          ? `category=${props.location.state.id}`
          : props.location.state.category === 'muscle'
          ? `muscles=${props.location.state.id}`
          : `equipment=${props.location.state.id}`;

      let next = `https://wger.de/api/v2/exercise/?language=2&${param}`;
      let arr = [];

      (async () => {
        while (next) {
          // eslint-disable-next-line no-loop-func
          await axios.get(next).then((res) => {
            res.data.results.forEach((result) => arr.push(result));
            next = res.data.next;
          });
        }
        setExercises(arr);
      })();
    }
  }, [props.location.state, exercises]);

  useEffect(() => {
    if (props.location.state.custom && !exercises.length) {
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
    }
  }, [props.location.state, exercises, user.authUser.uid]);

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
      category={wgerDict.exerciseCategoryList[exercise.category]}
      equipment={
        exercise.equipment ? wgerDict.equipment[exercise.equipment[0]] : null
      }
      isFavorite={favoriteExerciseIds.includes(exercise.id)}
      firebaseId={getFirebaseId(exercise)}
      exerciseId={exercise.id}
      custom={props.location.state.custom}
      firebaseSearchId={exercise.firebaseId}
    />
  ));

  return (
    <>
      <div>
        <h3>
          {props.location.state.wger
            ? props.location.state.subCategory
            : 'My custom exercises'}
        </h3>
        {exercises.length ? <ul>{displayResults}</ul> : null}
      </div>
    </>
  );
};

export default Results;
