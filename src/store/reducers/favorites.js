import { updateObject } from '../../shared/utility';
import { CHECK_FAVORITES } from '../actions/actionsTypes';

const initialState = {};

const setFavorites = (state, action) => {
  return updateObject(state, { favorites: action.favorites });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_FAVORITES:
      return setFavorites(state, action);
    default:
      return state;
  }
};

export default reducer;
