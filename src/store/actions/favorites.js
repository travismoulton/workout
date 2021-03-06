import axios from 'axios';

import { CHECK_FAVORITES, SET_ACTIVE_ROUTINE } from './actionsTypes';

export const setFavorites = (userId, accessToken) => {
  return async (dispatch) => {
    let favorites = [];
    await axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/favorites/${userId}.json?auth=${accessToken}`
      )
      .then((res) => {
        for (const key in res.data)
          favorites.push({ firebaseId: key, exercise: res.data[key].exercise });
      });
    return dispatch({ type: CHECK_FAVORITES, favorites });
  };
};

export const addToFavorites =
  (userId, exercise, accessToken) => async (dispatch) => {
    await axios.post(
      `https://workout-81691-default-rtdb.firebaseio.com/favorites/${userId}.json?auth=${accessToken}`,
      {
        exercise,
      }
    );
    dispatch(setFavorites(userId, accessToken));
  };

export const removeFromFavorites =
  (userId, firebaseId, accessToken) => async (dispatch) => {
    await axios.delete(
      `https://workout-81691-default-rtdb.firebaseio.com/favorites/${userId}/${firebaseId}.json?auth=${accessToken}`
    );
    dispatch(setFavorites(userId, accessToken));
  };

export const fetchActiveRoutine = (userId, accessToken) => async (dispatch) => {
  await axios
    .get(
      `https://workout-81691-default-rtdb.firebaseio.com/routines/${userId}.json?auth=${accessToken}`
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
      return dispatch({ type: SET_ACTIVE_ROUTINE, activeRoutine: false });
    });
};

export const setActiveRoutine = (routine) => ({
  type: SET_ACTIVE_ROUTINE,
  activeRoutine: routine,
});
