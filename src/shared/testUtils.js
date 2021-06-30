import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';

import authReducer from '../store/reducers/auth';
import favoritesReducer from '../store/reducers/favorites';
import workoutReducer from '../store/reducers/workout';
import userProfileReducer from '../store/reducers/userProfile';

const rootReducer = combineReducers({
  auth: authReducer,
  favorites: favoritesReducer,
  workout: workoutReducer,
  userProfile: userProfileReducer,
});

function customRender(
  ui,
  {
    preLoadedState,
    store = configureStore({ reducer: rootReducer, preLoadedState }),
    ...renderOptions
  } = {}
) {
  console.log(rootReducer);
  console.log(configureStore({ reducer: rootReducer, preLoadedState }));

  function wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return render(ui, { wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export const store = (preLoadedState) =>
  configureStore({ reducer: rootReducer, preLoadedState });
export { customRender };
