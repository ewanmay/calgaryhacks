import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { AppContext } from '../../context/context';
import { Game, GameSource } from '../../context/types';
import './Landing.css'

interface GameItemProps {
  game: Game
}

export default function GameItem({ game }: GameItemProps) {
  const [state, dispatch] = useContext(AppContext)

  return (
    <div className="col-12 p-0 flex game-list-item space-between">
      {game.source === GameSource.Free && <a href={game.website}>
        {game.name}
      </a>}
      {game.source === GameSource.Epic && <a href={game.website} target="_blank" rel="noreferrer">
        {game.name}
      </a>}
      {game.source === GameSource.Steam && <a className="col-12 p-0" href={`steam://run/${game.appid}//`}>
        <div className="col-12 px-0 game-list-item cursor flex space-between">
          <a className="col-auto" href={game.website} target="_blank" rel="noreferrer">
            <b>{game.name}</b>
            <i> (Steam)</i>
          </a>
          <div className="col-auto">
            {game.minPlayers && game.maxPlayers &&
              (<div className="">
                {game.minPlayers}-{game.maxPlayers}
              </div>)
            }
          </div>
          {/* Preferred min: Preferred max: player */}
          <a className="col-auto flex center" href={`steam://run/${game.appid}//`}>
            <i className="col-auto flex center">
              Open in Steam
                    <FontAwesomeIcon size="2x" className="px-2" icon={faPlayCircle} />
            </i>
          </a>
        </div>
      </a>}
    </div>
  );
}

