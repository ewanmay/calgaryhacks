import React, { useContext } from 'react';
import { AppContext } from '../../../context/context';
import { Game } from '../../../context/types';
import GameItem from '../GameItem';

interface GamesListProps {
  setOpenGame: any,
  setPlayerModal: any
}


export default function GamesList({ setOpenGame, setPlayerModal }: GamesListProps) {
  const [state, dispatch] = useContext(AppContext)

  return (
    <div className="col-12 p-0 flex fill center left column">
      <h4 className="p-1">
        Your Steam Games
          </h4>
      <div className="col-6 p-0 game-container left">
        {state.profile.steam.games.map((game: Game) => {
          return (
            <div className="col-12 px-0 game-list-item cursor flex space-between">
              <GameItem key={game.appid} game={game} setPlayerModal={setPlayerModal} setOpenGame={setOpenGame} showSetPlayer={true}/>
            </div>
          )
        })}
      </div>
    </div>
  );
}

