import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/context';
import { Game } from '../../context/types';
import './Landing.css'

interface GameItemProps {
  game: Game
}

export default function GameItem({ game }: GameItemProps) {
  const [state, dispatch] = useContext(AppContext)

  return (
    <div className="col-12 p-0 flex game-list-item">
      <a href={`steam://run/${game.appid}//`}>
        {game.name}
      </a>
    </div>
  );
}

