import React, { useContext } from 'react';
import { AppContext } from '../../context/context';
import { Game } from '../../context/types';
import GameItem from './GameItem';
import './Landing.css';
function CommonGames() {
  const [state, dispatch] = useContext(AppContext)

  return (
    <div className="col-12 p-0 flex fill center top landing">
      <div className="col-12 header">
        Shared Games
      </div>
      <div className="col-8 p-0 fill left top">
        {state.commonGames.steamGames.map((game: Game) => (<GameItem game={game}></GameItem>))}
        {state.commonGames.epicGames.map((game: Game) => (<GameItem game={game}></GameItem>))}
        {state.commonGames.freeGames.map((game: Game) => (<GameItem game={game}></GameItem>))}
      </div>
    </div>
  );
}

export default CommonGames;

