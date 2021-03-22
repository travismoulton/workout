import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import classes from './ExerciseResult.module.css';

const ExerciseResult = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (props.isFavorite) setIsFavorite(true);
  }, [props.isFavorite]);

  const addToFavorites = () => {
    if (user)
      axios.post(
        `https://workout-81691-default-rtdb.firebaseio.com/favorites/${user.authUser.uid}.json`,
        {
          exercise: props.wgerId,
        }
      );

    setIsFavorite(true);
  };

  const removeFromFavorites = () => {
    if (user)
      axios.delete(
        `https://workout-81691-default-rtdb.firebaseio.com/favorites/${user.authUser.uid}.json`,
        {
          exercise: props.wgerId,
        }
      );

    setIsFavorite(false);
  };

  const onSubmit = () =>
    isFavorite ? removeFromFavorites() : addToFavorites();

  const btn = (
    <button className={isFavorite ? classes.favorite : null} onClick={onSubmit}>
      Favorite
    </button>
  );

  return (
    <li className={classes.ExerciseResult}>
      <Link to="/">{props.name}</Link>
      {user ? btn : null}
    </li>
  );
};

export default ExerciseResult;
