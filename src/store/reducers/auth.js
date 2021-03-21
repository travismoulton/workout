import { updateObject } from '../../shared/utility';
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  AUTH_REGISTER_START,
  AUTH_REGISTER_DONE,
} from '../actions/actionsTypes';

const initalState = {
  error: null,
  loading: false,
  user: null,
  inRegistration: false,
};

const authStart = (state, action) =>
  updateObject(state, { error: false, loading: true });

const authSuccess = (state, action) =>
  updateObject(state, {
    user: action.user,
    error: null,
    loading: false,
  });

const authFail = (state, action) =>
  updateObject(state, { error: action.error, loading: false });

const authLogout = (state, action) => updateObject(state, { user: null });

const startRegisterState = (state, action) =>
  updateObject(state, { inRegistration: true });

const endRegisterState = (state, action) =>
  updateObject(state, { inRegistration: false });

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
    case AUTH_REGISTER_START:
      return startRegisterState(state, action);
    case AUTH_REGISTER_DONE:
      return endRegisterState(state, action);
    default:
      return state;
  }
};

export default reducer;
