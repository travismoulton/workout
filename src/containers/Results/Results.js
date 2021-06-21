import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import Spinner from '../../components/UI/Spinner/Spinner';
import ExerciseResult from '../../components/ExerciseResult/ExerciseResult';
import wgerDict from '../../shared/wgerDict';

const Results = (props) => {
  const [exerciseResults, setExerciseResults] = useState([]);
  const [favoriteExerciseIds, setFavoriteExerciseIds] = useState([]);
  const [error, setError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        We're having trouble loading the exercises right now. Please go back to
        the search page and try again
      </p>
    ),
  });
  const { favorites } = useSelector((state) => state.favorites);
  const { user, uid, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title =
      props.location.state.category === 'exercisecategory'
        ? `Category: ${props.location.state.subCategory}`
        : props.location.state.category === 'muscle'
        ? `Muscle: ${props.location.state.subCategory}`
        : props.location.state.category === 'equipment'
        ? `Equipment: ${props.location.state.subCategory}`
        : 'My Custom Exercises';
  }, []);

  useEffect(() => {
    const shouldFetchWgerExercises =
      props.location.state.wger && !exerciseResults.length;
    if (shouldFetchWgerExercises) {
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
          await axios
            .get(next, { timeout: 5000 })
            // eslint-disable-next-line no-loop-func
            .then((res) => {
              res.data.results.forEach((result) => arr.push(result));
              next = res.data.next;
            })
            .catch((err) => {
              setError({ ...error, isError: true });
            });
        }
        setExerciseResults(arr);
      })();
    }
  }, [props.location.state, exerciseResults, error]);

  useEffect(() => {
    const shouldFetchCustomExercises =
      props.location.state.custom && !exerciseResults.length && user;
    if (shouldFetchCustomExercises) {
      (async () => {
        await axios
          .get(
            `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${uid}.json?auth=${accessToken}`,
            { timeout: 5000 }
          )
          .then((res) => {
            const exerciseArr = [];
            for (const key in res.data) {
              exerciseArr.push({ ...res.data[key], firebaseId: key });
            }
            setExerciseResults(exerciseArr);
          })
          .catch((err) => {
            setError({ ...error, isError: true });
          });
      })();
    }
  }, [props.location.state, exerciseResults, user, error, uid, accessToken]);

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

  const displayResults = exerciseResults.map((exercise) => (
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
      {error.isError && error.message}
      <h3>
        {props.location.state.wger
          ? props.location.state.subCategory
          : 'My custom exercises'}
      </h3>
      {exerciseResults.length ? (
        <ul style={{ padding: '0' }}>{displayResults}</ul>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Results;
