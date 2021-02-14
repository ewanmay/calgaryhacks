import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/context';
import { Game, GameSource } from '../../context/types';
import './Landing.css'

interface GameItemProps {
  game: Game
}

export default function GameItem({ game }: GameItemProps) {
  const [state, dispatch] = useContext(AppContext)

  return (
    <div className="col-12 p-0 flex game-list-item">
      {game.source === GameSource.Free && <a href={game.website}>
        {game.name}
      </a>}
      {game.source === GameSource.Epic && <a href={game.website} target="_blank" rel="noreferrer">
        {game.name}
      </a>}
      {game.source === GameSource.Steam && <a href={`steam://run/${game.appid}//`}>
        {game.name}
      </a>}
    </div>
  );
}

