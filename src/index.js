import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import './index.css';
import App from './App';
import authReducer from './store/reducers/auth';
import favoritesReducer from './store/reducers/favorites';
import workoutReducer from './store/reducers/workout';
import userProfileReducer from './store/reducers/userProfile';
import Firebase, { FirebaseContext } from './components/Firebase/index';
import reportWebVitals from './reportWebVitals';

const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : null;

const rootReducer = combineReducers({
  auth: authReducer,
  favorites: favoritesReducer,
  workout: workoutReducer,
  userProfile: userProfileReducer,
});

const store = createStore(
  rootReducer,
  process.env.NODE_ENV === 'development'
    ? composeEnhancers(applyMiddleware(thunk))
    : applyMiddleware(thunk)
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <FirebaseContext.Provider value={new Firebase()}>
        <BrowserRouter>
          <FirebaseContext.Consumer>
            {(firebase) => <App firebase={firebase} />}
          </FirebaseContext.Consumer>
        </BrowserRouter>
      </FirebaseContext.Provider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
