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
import { CommonGames, Game, Steam } from './context/types';
function App() {
  const [state, dispatch] = useContext(AppContext)

  useEffect(() => {
    state.socket.on('available-games', (games: CommonGames) => dispatch({ type: "SET_COMMON_GAMES", payload: games }))
    state.socket.on('game-selected', (msg: Game) => dispatch({ type: "SELECT_GAME", payload: msg }))
    state.socket.on("get-steam-info-response", (data: Steam) => {
      dispatch({ type: "GET_STEAM_INFO", payload: data })
    })
  }, [dispatch, state.authState, state.socket])

  const history = useHistory()

  const handleNoAuth = () => {
    if (!state.authState.loggedIn) {
      history.push("/")
    }
    return state.authState.loggedIn ? <Redirect to="/home" /> : <Auth />
  }

  return (
    <div className="App flex column nowrap">
      {state.authState.loggedIn && <Navbar></Navbar>}
      <Switch>
        <Route path="/" exact >
          {handleNoAuth()}
        </Route>
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
