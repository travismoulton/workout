import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import './App.css';
import Login from './containers/Auth/Login/Login';
import Register from './containers/Auth/Register/Register';
import Logout from './components/Logout/Logout';
import Search from './containers/Search/Search';
import Layout from './components/Layout/Layout';
import { authCheckState, getUser } from './store/actions';

const firebaseui = require('firebaseui');
const firebase = require('firebase');

function App() {
  const isAuthenticated = useSelector((state) => state.auth.token !== null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authCheckState());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    dispatch(getUser());
  });

  const routes = (
    <Switch>
      <Route path="/register" component={Register} />
      <Route path="/logout" component={Logout} />
      <Route path="/search" component={Search} />
      <Route path="/" component={Login} />
    </Switch>
  );

  return (
    <div className="App">
      <Layout isAuthenticated={isAuthenticated}>{routes}</Layout>
    </div>
  );
}

export default App;
