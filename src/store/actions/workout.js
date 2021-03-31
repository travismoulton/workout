import {
  START_SEARCH,
  END_SEARCH,
  STORE_EXERCISES,
  ADD_EXERCISE,
} from './actionsTypes';

export const startSearchMode = () => ({ type: START_SEARCH });

export const endSearchMode = () => ({ type: END_SEARCH });

export const storeExercises = (exercises) => ({
  type: STORE_EXERCISES,
  exercises,
});

export const addExercise = (exercise) => ({ type: ADD_EXERCISE, exercise });
