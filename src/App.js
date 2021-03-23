import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';

import './App.css';
import Login from './containers/Auth/Login/Login';
import Register from './containers/Auth/Register/Register';
import Logout from './components/Logout/Logout';
import Search from './containers/Search/Search';
import Layout from './components/Layout/Layout';
import Results from './containers/Results/Results';
import ExerciseDetail from './containers/ExerciseDetail/ExerciseDetail';
import { logout, authSuccess } from './store/actions';
import { getFavorites } from './store/actions';
import { FirebaseContext } from './components/Firebase/index';

function App(props) {
  const [authUser, setAuthUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.user !== null);
  const inAuth = useSelector((state) => state.auth.inAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    props.firebase.auth.onAuthStateChanged((authUser) => {
      authUser ? setAuthUser({ authUser }) : setAuthUser(null);
      if (!loaded) setLoaded(true);
    });
  }, [props.firebase.auth, loaded]);

  useEffect(() => {
    if (authUser && !isAuthenticated && !inAuth)
      dispatch(authSuccess(authUser));

    if (!authUser) dispatch(logout());
  }, [authUser, isAuthenticated, dispatch, inAuth]);

  useEffect(() => {
    if (authUser) dispatch(getFavorites(authUser.authUser.uid));
  }, [authUser, dispatch]);

  const routes = (
    <Switch>
      <Route path="/register">
        <FirebaseContext.Consumer>
          {(firebase) => (
            <Register firebase={firebase} history={props.history} />
          )}
        </FirebaseContext.Consumer>
      </Route>
      <Route path="/logout">
        <FirebaseContext.Consumer>
          {(firebase) => <Logout firebase={firebase} />}
        </FirebaseContext.Consumer>
      </Route>
      <Route path="/search" component={Search} />
      <Route path="/results/:category/:query" component={Results} />
      <Route path="/exercise/:name" component={ExerciseDetail} />
      <Route path="/">
        <FirebaseContext.Consumer>
          {(firebase) => <Login firebase={firebase} />}
        </FirebaseContext.Consumer>
      </Route>
    </Switch>
  );

  return (
    <div className="App">
      {loaded ? (
        <Layout isAuthenticated={isAuthenticated}>{routes}</Layout>
      ) : null}
    </div>
  );
}

export default withRouter(App);
