import axios from 'axios';

import { CHECK_FAVORITES, ADD_FAVROITE, REMOVE_FAVORITE } from './actionsTypes';

export const getFavorites = (userId, favorites) => {
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

export const setFavorites = (userId) => (dispatch) =>
  dispatch(getFavorites(userId, []));

export const addToFavorites = (userId, exercise) => (dispatch) => {
  axios
    .post(
      `https://workout-81691-default-rtdb.firebaseio.com/favorites/${userId}.json`,
      {
        exercise,
      }
    )
    .then(dispatch(setFavorites(userId)));
};

export const removeFromFavorites = (userId, firebaseId) => (dispatch) => {
  axios
    .delete(
      `https://workout-81691-default-rtdb.firebaseio.com/favorites/${userId}/${firebaseId}.json`
    )
    .then(dispatch(setFavorites(userId)));
};
