import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import ExerciseResult from '../../components/ExerciseResult/ExerciseResult';

const Results = (props) => {
  const [exercises, setExercises] = useState([]);
  const [favoriteExerciseIds, setFavoriteExerciseIds] = useState([]);
  // const [firebaseIds, setFirebaseIds] = useState([]);

  const favorites = useSelector((state) => state.favorites.favorites);
  const wgerDict = useSelector((state) => state.wgerDict);

  useEffect(() => {
    const param =
      props.location.state.category === 'exercisecategory'
        ? `category=${props.location.state.id}`
        : props.location.state.category === 'muscle'
        ? `muscles=${props.location.state.id}`
        : `equipment=${props.location.state.id}`;

    axios
      .get(`https://wger.de/api/v2/exercise/?language=2&${param}`)
      .then((res) => setExercises(res.data.results));
  }, [props.location.state.id, props.location.state.category]);

  useEffect(() => {
    if (favorites.length) {
      console.log('what the fuck');
      setFavoriteExerciseIds(favorites.map((favorite) => favorite.exercise));
    }
  }, [favorites]);

  console.log(favoriteExerciseIds);

  const displayResults = exercises.map((exercise) => (
    <ExerciseResult
      key={exercise.name}
      name={exercise.name}
      wgerId={exercise.uuid}
      category={wgerDict.exerciseCategoryList[exercise.category]}
      equipment={wgerDict.equipment[exercise.equipment[0]]}
      isFavorite={favoriteExerciseIds.includes(exercise.uuid)}
      firebaseId={
        favoriteExerciseIds.includes(exercise.uuid)
          ? favorites.filter(
              (favorite) => favorite.exercise === exercise.uuid
            )[0].firebaseId
          : null
      }
      exerciseId={exercise.id}
    />
  ));

  return (
    <div>
      <h3>{props.location.state.subCategory}</h3>
      {exercises.length ? <ul>{displayResults}</ul> : null}
    </div>
  );
};

export default Results;
