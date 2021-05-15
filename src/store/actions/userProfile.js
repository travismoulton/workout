import {
  SET_WORKOUTS,
  SET_ROUTINES,
  SET_RECORDED_WORKOUTS,
} from './actionsTypes';

export const setRoutines = (routines) => ({ type: SET_ROUTINES, routines });

export const setWorkouts = (workouts) => ({ type: SET_WORKOUTS, workouts });

export const setRecordedWorkouts = (recordedWorkouts) => ({
  type: SET_RECORDED_WORKOUTS,
  recordedWorkouts,
});
