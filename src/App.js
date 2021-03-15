import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import './App.css';
import Login from './containers/Auth/Login/Login';
import Register from './containers/Auth/Register/Register';
import Logout from './components/Logout/Logout';
import Search from './containers/Search/Search';
import { authCheckState } from './store/actions';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.token !== null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authCheckState());
  }, [isAuthenticated, dispatch]);

  return (
    <div className="App">
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/logout" component={Logout} />
        <Route path="/search" component={Search} />
        <Route path="/" component={Login} />
      </Switch>
    </div>
  );
}

export default App;
