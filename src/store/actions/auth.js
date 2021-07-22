import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  AUTH_RESET,
} from './actionsTypes';

export const authStart = () => ({ type: AUTH_START });

export const authSuccess = (user) => {
  return { type: AUTH_SUCCESS, user };
};

export const authFail = (error) => ({ type: AUTH_FAIL, error });

export const logout = () => ({ type: AUTH_LOGOUT });

export const authReset = () => ({ type: AUTH_RESET });
