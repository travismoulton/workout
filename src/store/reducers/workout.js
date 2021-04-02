import {
  START_SEARCH,
  SET_EXERCISES,
  ADD_EXERCISE,
  SET_WORKOUT_FORM_DATA,
} from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

const intialState = {
  buildingWorkout: false,
  exercises: [],
  formData: {
    workoutName: '',
    targetArea: '',
    secondaryTarget: '',
  },
};

const enterSearchMode = (state, action) =>
  updateObject(state, { buildingWorkout: true });

const setExercises = (state, action) =>
  updateObject(state, { exercises: action.exercises, buildingWorkout: false });

const addExercise = (state, action) =>
  updateObject(state, {
    exercises: state.exercises.concat(action.exercise),
    buildingWorkout: false,
  });

const setFormData = (state, action) =>
  updateObject(state, {
    ...action.formData,
    [action.formEl]: action.val,
  });

const reducer = (state = intialState, action) => {
  switch (action.type) {
    case START_SEARCH:
      return enterSearchMode(state, action);
    case SET_EXERCISES:
      return setExercises(state, action);
    case ADD_EXERCISE:
      return addExercise(state, action);
    case SET_WORKOUT_FORM_DATA:
      return setFormData(state, action);
    default:
      return state;
  }
};

export default reducer;
