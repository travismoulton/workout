import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import ExerciseResult from '../../components/ExerciseResult/ExerciseResult';

const Results = (props) => {
  const [exercises, setExercises] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const user = useSelector((state) => state.auth.user);

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
    if (user)
      axios
        .get(
          `https://workout-81691-default-rtdb.firebaseio.com/favorites/${user.authUser.uid}.json`
        )
        .then((res) => {
          let arr = [];
          for (const key in res.data) arr.push(res.data[key].exercise);
          setFavorites(arr);
        });
  }, [user]);

  const displayResults = exercises.map((exercise) => (
    <ExerciseResult
      key={exercise.name}
      name={exercise.name}
      wgerId={exercise.uuid}
      isFavorite={favorites.includes(exercise.uuid)}
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
