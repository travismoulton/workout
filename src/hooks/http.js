import { useReducer, useCallback } from 'react';
import axios from 'axios';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  reqIdentifier: null,
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        reqIdentifier: action.reqIdentifier,
      };
    case 'RESPONSE':
      return {
        ...currentHttpState,
        loading: false,
        data: action.data,
        extra: action.extra,
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;

    default:
      throw new Error('Something went wrong');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);
  // console.log(httpState);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: 'SEND', reqIdentifier });
      axios({
        method,
        url,
        body,
        timeout: 5000,
      })
        .then((res) => {
          console.log(res);
          dispatchHttp({
            type: 'RESPONSE',
            data: res.data,
            extra: reqExtra,
          });
        })
        .catch((err) => {
          dispatchHttp({
            type: 'ERROR',
            errorMessage: 'Come back later',
          });
        });
    },
    []
  );

  const sendSyncRequest = useCallback(
    async (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: 'SEND', reqIdentifier });
      await axios({
        method,
        url,
        body,
        timeout: 5000,
      })
        .then((res) => {
          console.log(reqIdentifier);
          dispatchHttp({
            type: 'RESPONSE',
            data: res.data,
            extra: reqExtra,
          });
        })
        .catch((err) => {
          dispatchHttp({
            type: 'ERROR',
            errorMessage: 'Come back later',
          });
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest,
    sendSyncRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.reqIdentifier,
    clear: clear,
  };
};

export default useHttp;
