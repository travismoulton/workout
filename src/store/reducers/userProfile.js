import { updateObject } from '../../shared/utility';
import {
  SET_ROUTINES,
  SET_RECORDED_WORKOUTS,
  SET_WORKOUTS,
  TOGGLE_ROUTINE_REFRESH,
} from '../actions/actionsTypes';

const intialState = {
  workouts: null,
  routines: null,
  recordedWorkouts: null,
  refreshRoutines: false,
};

const setWorkouts = (state, action) =>
  updateObject(state, { workouts: action.workouts });

const setRoutines = (state, action) =>
  updateObject(state, { routines: action.routines });

const setRecordedWorkouts = (state, action) =>
  updateObject(state, { recordedWorkouts: action.recordedWorkouts });

const toggleRoutineRefresh = (state, action) =>
  updateObject(state, { refreshRoutines: !state.refreshRoutines });

const reducer = (state = intialState, action) => {
  switch (action.type) {
    case SET_ROUTINES:
      return setRoutines(state, action);
    case SET_WORKOUTS:
      return setWorkouts(state, action);
    case SET_RECORDED_WORKOUTS:
      return setRecordedWorkouts(state, action);
    case TOGGLE_ROUTINE_REFRESH:
      return toggleRoutineRefresh(state, action);
    default:
      return state;
  }
};

export default reducer;
