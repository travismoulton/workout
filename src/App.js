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
import CreateWorkout from './containers/CreateWorkout/CreateWorkout';
import CreateRoutine from './containers/CreateRoutine/CreateRoutine';
import CreateExercise from './containers/CreateExercise/CreateExercise';
import UserProfile from './containers/UserProfile/UserProfile';
import RecordWorkout from './containers/RecordWorkout/RecordWorkout';
import RecordedWorkoutDetail from './components/RecordedWorkoutDetail/RecordedWorkoutDetail';
import {
  logout,
  authSuccess,
  setFavorites,
  fetchActiveRoutine,
} from './store/actions';
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
    if (authUser) dispatch(setFavorites(authUser.authUser.uid));
  }, [authUser, dispatch]);

  useEffect(() => {
    if (authUser) dispatch(fetchActiveRoutine(authUser.authUser.uid));
  }, [authUser, dispatch]);

  const routes = isAuthenticated ? (
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
      <Route path="/results/my-custom-exercises" component={Results} />
      <Route path="/results/:category/:query" component={Results} />
      <Route path="/exercise/:name" component={ExerciseDetail} />
      <Route path="/create-workout" component={CreateWorkout} />
      <Route path="/create-routine" component={CreateRoutine} />
      <Route path="/my-profile" component={UserProfile} />
      <Route path="/workout-detail/:workout" component={CreateWorkout} />
      <Route path="/routine-detail/:routine" component={CreateRoutine} />
      <Route path="/record-workout" component={RecordWorkout} />
      <Route path="/create-exercise" component={CreateExercise} />
      <Route
        path="/recorded-workout-detail/:id"
        component={RecordedWorkoutDetail}
      />
      <Route path="/login">
        <FirebaseContext.Consumer>
          {(firebase) => <Login firebase={firebase} history={props.history} />}
        </FirebaseContext.Consumer>
      </Route>
      <Route path="/" component={Search} />
    </Switch>
  ) : (
    <Switch>
      <Route path="/register">
        <FirebaseContext.Consumer>
          {(firebase) => (
            <Register firebase={firebase} history={props.history} />
          )}
        </FirebaseContext.Consumer>
      </Route>
      <Route path="/search" component={Search} />
      <Route path="/results/:category/:query" component={Results} />
      <Route path="/exercise/:name" component={ExerciseDetail} />
      <Route path="/login">
        <FirebaseContext.Consumer>
          {(firebase) => <Login firebase={firebase} history={props.history} />}
        </FirebaseContext.Consumer>
      </Route>
      <Route path="/" component={Search} />
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
