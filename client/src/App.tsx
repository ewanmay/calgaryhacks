import React, { useContext, useEffect } from 'react';
import { AppContext } from './context/context';
import './App.css';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import Auth from './components/pages/Auth';
import Landing from './components/pages/Landing';
import Groups from './components/pages/Groups';
import Profile from './components/pages/Profile';
import Register from './components/pages/Register';
import Navbar from './components/shared/Navbar';
function App() {
  const [state, dispatch] = useContext(AppContext)

  useEffect(() => {
    setInterval(() => state.socket.emit("hello"), 2000);
    state.socket.on('hello-response', () => console.log("server said hello"));
  }, [])

  const history = useHistory()

  const handleNoAuth = () => {
    if (!state.authState.loggedIn) {
      history.push("/")
    }
    return state.authState.loggedIn ? <Redirect to="/home" /> : <Auth />
  }

  return (
    <div className="App flex column">
      {state.authState.loggedIn && <Navbar></Navbar>}
      {handleNoAuth()}
      <Switch>
        <Route path="/home">
          <Landing />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/groups">
          <Groups />
        </Route>
        <Route path="/sign-up">
          <Register />
        </Route>
        <Redirect to="/"></Redirect>
      </Switch>
    </div>
  );
}

export default App;
