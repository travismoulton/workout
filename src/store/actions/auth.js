import axios from 'axios';
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
} from './actionsTypes';

const firebase = require('firebase');
const firebaseui = require('firebaseui');

export const authStart = () => {
  return { type: AUTH_START };
};

export const authSuccess = (tokenId, userId) => {
  return {
    type: AUTH_SUCCESS,
    tokenId,
    userId,
  };
};

export const authFail = (error) => {
  return { type: AUTH_FAIL, error };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return { type: AUTH_LOGOUT };
};

const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const login = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = { email, password, returnSecureToken: true };
    const url =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD0ikjJ5GfckmGG7ku0iE3zQRupx5VeC4E';

    axios.post(url, authData).then((res) => {
      const expirationDate = new Date(
        new Date().getTime() + res.data.expiresIn * 1000
      );
      localStorage.setItem('token', res.data.idToken);
      localStorage.setItem('expirationDate', expirationDate);
      localStorage.setItem('userId', res.data.localId);
      dispatch(authSuccess(res.data.idToken, res.data.localId));
      dispatch(checkAuthTimeout(res.data.expiresIn));
    });
  };
};

export const register = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = { email, password, returnSecureToken: true };
    const url =
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD0ikjJ5GfckmGG7ku0iE3zQRupx5VeC4E';

    axios.post(url, authData).then((res) => {
      const expirationDate = new Date(
        new Date().getTime() + res.data.expiresIn * 1000
      );
      localStorage.setItem('token', res.data.idToken);
      localStorage.setItem('expirationDate', expirationDate);
      localStorage.setItem('userId', res.data.localId);
      dispatch(authSuccess(res.data.idToken, res.data.localId));
      dispatch(checkAuthTimeout(res.data.expiresIn));
    });
  };
};

export const authCheckState = () => (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) {
    dispatch(logout());
  } else {
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    if (Date.now() < expirationDate) {
      dispatch(authSuccess(token, localStorage.getItem('userId')));
      dispatch(
        checkAuthTimeout(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        )
      );
    } else {
      dispatch(logout());
    }
  }
};

export const getUser = () => {
  console.log(firebase);
  firebase.default.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user);
    } else {
      console.log('no user');
    }
  });
};
