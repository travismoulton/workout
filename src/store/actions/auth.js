import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
} from './actionsTypes';

export const authStart = () => ({ type: AUTH_START });

export const authSuccess = (user) => ({
  type: AUTH_SUCCESS,
  user,
});

export const authFail = (error) => ({ type: AUTH_FAIL, error });

export const logout = () => ({ type: AUTH_LOGOUT });

export const login = (user) => ({ type: AUTH_SUCCESS, user });
