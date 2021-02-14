import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/context';
import { Game } from '../../context/types';
import GameItem from './GameItem';

function CommonGames() {
  const [state, dispatch] = useContext(AppContext)
  const [freeGamesFilter, setFreeGamesFilter] = useState(true)
  const [steamGamesFilter, setSteamGamesFilter] = useState(true)
  const [epicGamesFilter, setEpicGamesFilter] = useState(true)

  useEffect(() => {
    state.socket.on('filter-free-games-changed', (filter: any) => {
      setFreeGamesFilter(filter)
    })
    state.socket.on('filter-steam-games-changed', (filter: any) => {
      setSteamGamesFilter(filter)
    })
    state.socket.on('filter-epic-games-changed', (filter: any) => {
      setEpicGamesFilter(filter)
    })
  }, [])

  const updateFreeGamesFilter = (event: any) => {
    state.socket.emit('filter-free-games', event.target.checked)
  }
  const updateSteamGamesFilter = (event: any) => {
    state.socket.emit('filter-steam-games', event.target.checked)
  }
  const updateEpicGamesFilter = (event: any) => {
    state.socket.emit('filter-epic-games', event.target.checked)
  }

  return (
    <div className="col-12 p-0 flex fill center top landing column">
      <div className="col-12 header">
        Shared Games
      </div>
      <div className="col-12 game-list-item flex space-between ">
        <div className="custom-control custom-checkbox">
          <input checked={freeGamesFilter} className="custom-control-input" type="checkbox" id="freeGames" onChange={updateFreeGamesFilter} />
          <label className="custom-control-label" htmlFor="freeGames"> Free Games </label>
        </div>
        <div className="custom-control custom-checkbox">
          <input checked={steamGamesFilter} className="custom-control-input" type="checkbox" id="steamGames" onChange={updateSteamGamesFilter} />
          <label className="custom-control-label" htmlFor="steamGames"> Steam Games </label>
        </div>
        <div className="custom-control custom-checkbox">
          <input checked={epicGamesFilter} className="custom-control-input" type="checkbox" id="epicGames" onChange={updateEpicGamesFilter} />
          <label className="custom-control-label" htmlFor="epicGames"> Epic Games </label>
        </div>
      </div>
      <div className="col-12 p-0 fill left top center common-game-container">
        {state.commonGames.steamGames.map((game: Game) => (<GameItem game={game} />))}
        {state.commonGames.epicGames.map((game: Game) => (<GameItem game={game} />))}
        {state.commonGames.freeGames.map((game: Game) => (<GameItem game={game} />))}
      </div>
    </div>
  );
}

export default CommonGames;

