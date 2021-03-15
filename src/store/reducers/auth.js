import { updateObject } from '../../shared/utility';
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
} from '../actions/actionsTypes';

const initalState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
};

const authStart = (state, action) =>
  updateObject(state, { error: false, loading: true });

const authSuccess = (state, action) =>
  updateObject(state, {
    token: action.tokenId,
    userId: action.userId,
    error: null,
    loading: false,
  });

const authFail = (state, action) =>
  updateObject(state, { error: action.error, loading: false });

const authLogout = (state, action) =>
  updateObject(state, { token: null, userId: null });

const reducer = (state = initalState, action) => {
  switch (action.type) {
    case AUTH_START:
      return authStart(state, action);
    case AUTH_SUCCESS:
      return authSuccess(state, action);
    case AUTH_FAIL:
      return authFail(state, action);
    case AUTH_LOGOUT:
      return authLogout(state, action);
    default:
      return state;
  }
};

export default reducer;
