import { updateObject } from '../../shared/utility';
import { CHECK_FAVORITES, SET_ACTIVE_ROUTINE } from '../actions/actionsTypes';

const initialState = {};

const setFavorites = (state, action) =>
  updateObject(state, { favorites: action.favorites });

const setActiveRoutine = (state, action) =>
  updateObject(state, { activeRoutine: action.activeRoutine });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_FAVORITES:
      return setFavorites(state, action);
    case SET_ACTIVE_ROUTINE:
      return setActiveRoutine(state, action);
    default:
      return state;
  }
};

export default reducer;
