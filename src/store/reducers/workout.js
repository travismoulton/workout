import {
  START_SEARCH,
  END_SEARCH,
  SET_EXERCISES,
  ADD_EXERCISE,
} from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

const intialState = { buildingWorkout: false, exercises: [] };

const enterSearchMode = (state, action) =>
  updateObject(state, { buildingWorkout: true });

const exitSearchMode = (state, action) =>
  updateObject(state, { buildingWorkout: false, exercises: [] });

const setExercises = (state, action) =>
  updateObject(state, { exercises: action.exercises, buildingWorkout: false });

const addExercise = (state, action) =>
  updateObject(state, {
    exercises: state.exercises.concat(action.exercise),
    buildingWorkout: false,
  });

const reducer = (state = intialState, action) => {
  switch (action.type) {
    case START_SEARCH:
      return enterSearchMode(state, action);
    case END_SEARCH:
      return exitSearchMode(state, action);
    case SET_EXERCISES:
      return setExercises(state, action);
    case ADD_EXERCISE:
      return addExercise(state, action);
    default:
      return state;
  }
};

export default reducer;
