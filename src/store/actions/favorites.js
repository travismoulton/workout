import axios from 'axios';

import { CHECK_FAVORITES, SET_ACTIVE_ROUTINE } from './actionsTypes';

export const setFavorites = (userId) => {
  return async (dispatch) => {
    let favorites = [];
    await axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/favorites/${userId}.json`
      )
      .then((res) => {
        for (const key in res.data)
          favorites.push({ firebaseId: key, exercise: res.data[key].exercise });
      });
    return dispatch({ type: CHECK_FAVORITES, favorites });
  };
};

export const addToFavorites = (userId, exercise) => async (dispatch) => {
  await axios.post(
    `https://workout-81691-default-rtdb.firebaseio.com/favorites/${userId}.json`,
    {
      exercise,
    }
  );
  dispatch(setFavorites(userId));
};

export const removeFromFavorites = (userId, firebaseId) => async (dispatch) => {
  await axios.delete(
    `https://workout-81691-default-rtdb.firebaseio.com/favorites/${userId}/${firebaseId}.json`
  );
  dispatch(setFavorites(userId));
};

export const fetchActiveRoutine = (userId) => async (dispatch) => {
  await axios
    .get(
      `https://workout-81691-default-rtdb.firebaseio.com/routines/${userId}.json`
    )
    .then((res) => {
      for (const key in res.data) {
        if (res.data[key].activeRoutine) {
          return dispatch({
            type: SET_ACTIVE_ROUTINE,
            activeRoutine: { ...res.data[key], firebaseId: key },
          });
        }
      }
      return dispatch({ type: SET_ACTIVE_ROUTINE, activeRoutine: {} });
    });
};

export const setActiveRoutine = (routine) => ({
  type: SET_ACTIVE_ROUTINE,
  routine,
});
