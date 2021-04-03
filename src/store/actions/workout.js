import {
  START_SEARCH,
  SET_EXERCISES,
  ADD_EXERCISE,
  SET_WORKOUT_FORM_DATA,
  CLEAR_WORKOUT_FORM_DATA,
} from './actionsTypes';

export const startSearchMode = () => ({ type: START_SEARCH });

export const addExercise = (exercise) => ({ type: ADD_EXERCISE, exercise });

export const changeExerciseOrder = (exercises, exerciseId, direction) => {
  const index = exercises.indexOf(
    exercises.filter((exercise) => exercise.id === exerciseId)[0]
  );

  const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]]);

  direction === 'up'
    ? swap(exercises, index, index - 1)
    : swap(exercises, index, index + 1);

  return { type: SET_EXERCISES, exercises };
};

export const removeExercise = (exercises, exerciseId) => {
  const index = exercises.indexOf(
    exercises.filter((exercise) => exercise.id === exerciseId)[0]
  );

  return exercises.length > 1
    ? {
        type: SET_EXERCISES,
        exercises: [
          ...exercises.slice(0, index),
          ...exercises.slice(index + 1),
        ],
      }
    : { type: SET_EXERCISES, exercises: [] };
};

export const updateExerciseData = (exercises, exerciseId, param, val) => {
  const newExercises = exercises.map((exercise) =>
    exercise.id === exerciseId ? { ...exercise, [param]: val } : exercise
  );

  return { type: SET_EXERCISES, exercises: newExercises };
};

export const clearExercises = () => ({ type: SET_EXERCISES, exercises: [] });

export const setFormData = (formData, formEl, val) => ({
  type: SET_WORKOUT_FORM_DATA,
  formData,
  formEl,
  val,
});

export const clearForm = () => ({ type: CLEAR_WORKOUT_FORM_DATA });
