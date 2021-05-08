import {
  START_SEARCH,
  SET_EXERCISES,
  ADD_EXERCISE,
  SET_WORKOUT_FORM_DATA,
  SET_ENTIRE_WORKOUT_FORM,
  CLEAR_WORKOUT_FORM_DATA,
  RESET_WORKOUT_STORE,
  SET_FIREBASE_ID,
} from './actionsTypes';

export const startSearchMode = () => ({ type: START_SEARCH });

export const addExercise = (exercise) => ({ type: ADD_EXERCISE, exercise });

export const setExercises = (exercises) => ({ type: SET_EXERCISES, exercises });

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
        updated: true,
      }
    : { type: SET_EXERCISES, exercises: [], updated: true };
};

export const addSetToExercise = (exercises, exerciseId) => {
  const newExercises = exercises.map((exercise) =>
    exercise.id === exerciseId
      ? { ...exercise, sets: [...exercise.sets, { weight: 0, reps: 1 }] }
      : exercise
  );
  return { type: SET_EXERCISES, exercises: newExercises, updated: true };
};

export const addTimeFocusedSetToExercise = (exercises, exerciseId) => {
  const newExercises = exercises.map((exercise) =>
    exercise.id === exerciseId
      ? { ...exercise, sets: [...exercise.sets, { minutes: 0, seconds: 0 }] }
      : exercise
  );
  return { type: SET_EXERCISES, exercises: newExercises, updated: true };
};

export const resetSetsToTimeFocus = (exercises, exerciseId) => {
  const newExercises = exercises.map((exercise) =>
    exercise.id === exerciseId
      ? { ...exercise, sets: [{ minutes: 0, seconds: 0 }] }
      : exercise
  );
  return { type: SET_EXERCISES, exercises: newExercises, updated: true };
};

export const resetSetsToRepsFocus = (exercises, exerciseId) => {
  const newExercises = exercises.map((exercise) =>
    exercise.id === exerciseId
      ? { ...exercise, sets: [{ weight: 0, reps: 1 }] }
      : exercise
  );
  return { type: SET_EXERCISES, exercises: newExercises, updated: true };
};

export const removeSetFromExercise = (exercises, exerciseId, setIndex) => {
  const newExercises = exercises.map((exercise) =>
    exercise.id === exerciseId
      ? {
          ...exercise,
          sets: [
            ...exercise.sets.slice(0, setIndex),
            ...exercise.sets.slice(setIndex + 1),
          ],
        }
      : exercise
  );
  return { type: SET_EXERCISES, exercises: newExercises, updated: true };
};

export const updateExerciseData = (
  exercises,
  exerciseId,
  param,
  val,
  setIndex
) => {
  const newExercises = exercises.map((exercise) =>
    exercise.id === exerciseId
      ? {
          ...exercise,
          sets: [
            ...exercise.sets.slice(0, setIndex),
            { ...exercise.sets[setIndex], [param]: val },
            ...exercise.sets.slice(setIndex + 1),
          ],
        }
      : exercise
  );

  return { type: SET_EXERCISES, exercises: newExercises, updated: true };
};

export const clearExercises = () => ({ type: SET_EXERCISES, exercises: [] });

export const setFormData = (formData, formEl, val) => ({
  type: SET_WORKOUT_FORM_DATA,
  formData,
  formEl,
  val,
});

export const setEntireForm = (workoutName, targetArea, secondaryTarget) => ({
  type: SET_ENTIRE_WORKOUT_FORM,
  workoutName,
  targetArea,
  secondaryTarget,
});

export const clearForm = () => ({ type: CLEAR_WORKOUT_FORM_DATA });

export const resetWorkoutStore = () => ({ type: RESET_WORKOUT_STORE });

export const setFirebaseId = (firebaseId) => ({
  type: SET_FIREBASE_ID,
  firebaseId,
});
