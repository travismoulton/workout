import { updateObject } from '../../shared/utility';
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  AUTH_RESET,
} from '../actions/actionsTypes';

const initalState = {
  error: null,
  loading: false,
  user: null,
  inAuth: false,
  uid: null,
  accessToken: null,
};

const authStart = (state, action) =>
  updateObject(state, { error: false, loading: true, inAuth: true });

const authSuccess = (state, action) =>
  updateObject(state, {
    user: action.user,
    uid: action.user.authUser.uid,
    accessToken: action.user.authUser.za,
    error: null,
    loading: false,
    inAuth: false,
  });

const authFail = (state, action) =>
  updateObject(state, { error: action.error, loading: false });

const authLogout = (state, action) => updateObject(state, { user: null });

const authReset = (state, action) =>
  updateObject(state, {
    loading: false,
    user: null,
    inAuth: false,
  });

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
    case AUTH_RESET:
      return authReset(state, action);
    default:
      return state;
  }
};

export default reducer;
