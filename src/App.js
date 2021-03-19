import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import './App.css';
import Login from './containers/Auth/Login/Login';
import Register from './containers/Auth/Register/Register';
import Logout from './components/Logout/Logout';
import Search from './containers/Search/Search';
import Layout from './components/Layout/Layout';
import { authCheckState, authUpdateState } from './store/actions';
import { FirebaseContext } from './components/Firebase/index';

function App(props) {
  const [authUser, setAuthUser] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isUser);
  const dispatch = useDispatch();
  const isUser = useSelector((state) => state.auth.isUser);

  useEffect(() => {
    props.firebase.auth.onAuthStateChanged((authUser) =>
      authUser ? setAuthUser({ authUser }) : setAuthUser(null)
    );
  }, [props.firebase.auth]);

  // useEffect(() => {
  //   dispatch(authCheckState());
  // }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (authUser) {
      dispatch(authUpdateState);
    }
  }, [isAuthenticated, dispatch, authUser]);

  console.log('authUser', authUser);
  console.log('isAuthenticated', isAuthenticated);

  const routes = (
    <Switch>
      {/* <Route path="/register" component={Register} /> */}
      <Route path="/register">
        <FirebaseContext.Consumer>
          {(firebase) => <Register firebase={firebase} />}
        </FirebaseContext.Consumer>
      </Route>
      {/* <Route path="/logout" component={Logout} /> */}
      <Route path="/logout">
        <FirebaseContext.Consumer>
          {(firebase) => <Logout firebase={firebase} />}
        </FirebaseContext.Consumer>
      </Route>
      <Route path="/search" component={Search} />
      {/* <Route path="/" component={Login} /> */}
      <Route path="/">
        <FirebaseContext.Consumer>
          {(firebase) => <Login firebase={firebase} />}
        </FirebaseContext.Consumer>
      </Route>
    </Switch>
  );

  return (
    <div className="App">
      <Layout isAuthenticated={isAuthenticated}>{routes}</Layout>
    </div>
  );
}

export default App;
