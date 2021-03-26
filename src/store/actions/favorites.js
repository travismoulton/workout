import axios from 'axios';

import { CHECK_FAVORITES, ADD_FAVROITE, REMOVE_FAVORITE } from './actionsTypes';

export const getFavorites = (userId) => {
  let favorites = [];
  axios
    .get(
      `https://workout-81691-default-rtdb.firebaseio.com/favorites/${userId}.json`
    )
    .then((res) => {
      for (const key in res.data)
        favorites.push({ firebaseId: key, exercise: res.data[key].exercise });
    });

  return { type: CHECK_FAVORITES, favorites };
};

export const addToFavorites = (userId, exercise) => {
  return (dispatch) => {
    console.log('addToFavorites', exercise);
    axios
      .post(
        `https://workout-81691-default-rtdb.firebaseio.com/favorites/${userId}.json`,
        {
          exercise,
        }
      )
      .then(dispatch(getFavorites(userId)));
  };
};

export const removeFromFavorites = (userId, firebaseId, exercise) => {
  console.log('removeFromFavorites', firebaseId);
  return (dispatch) => {
    axios
      .delete(
        `https://workout-81691-default-rtdb.firebaseio.com/favorites/${userId}/${firebaseId}.json`,
        {
          exercise,
        }
      )
      .then(dispatch(getFavorites(userId)));
  };
};
