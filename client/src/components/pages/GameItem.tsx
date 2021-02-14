import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { AppContext } from '../../context/context';
import { Game, GameSource } from '../../context/types';

import './GameItem.css'

interface GameItemProps {
  game: Game,
  showSetPlayer?: boolean,
  setPlayerModal?: any,
  setOpenGame?: any
}

export default function GameItem({ game, showSetPlayer, setOpenGame, setPlayerModal }: GameItemProps) {
  const [state, dispatch] = useContext(AppContext)

  const voteForFreeGame = (event: any) => {
    console.log("Target: ", event.target)
    state.socket.emit('vote-for-free-game', state.authState.username, event.target.id)
  }
  const voteForSteamGame = (event: any) => {
    console.log("Target: ", event.target)
    state.socket.emit('vote-for-steam-game', state.authState.username, event.target.id)
  }
  const voteForEpicGame = (event: any) => {
    console.log("Target: ", event.target)
    state.socket.emit('vote-for-epic-game', state.authState.username, event.target.id)
  }

  return (
    <div className="col-12 p-0 flex game-list-item space-between">
      {game.source === GameSource.Free && (
        <div className="col-12 px-0 game-list-item cursor flex space-between">
          <a className="col-4 flex left" href={game.website} target="_blank" rel="noreferrer">
            <b style={{ marginRight: 4 }}>{game.name}</b>
          </a>
          {!showSetPlayer && (
            <div className="flex center">
              <div className="test">
                votes: {game.votes ? game.votes : "0"}
              </div>
              <Button id={game.appid} className="mx-2" onClick={voteForFreeGame}>Vote</Button>
            </div>
          )}

          {game.minPlayers && game.maxPlayers &&
            (<div className="col-2">
              <div className="">
                {game.minPlayers}-{game.maxPlayers} players
              </div>
            </div>)
          }
          <div className="col-3 flex center">
            <i className="col-auto flex center">
            </i>
          </div>
        </div>)}
      {game.source === GameSource.Epic && <a href={game.website} target="_blank" rel="noreferrer">
        {game.name}
      </a>}
      {game.source === GameSource.Steam && (
        <div className="col-12 px-0 game-list-item cursor flex space-between ">
          <a className="col-4 flex left" href={game.website} target="_blank" rel="noreferrer">
            <b style={{ marginRight: 4 }}>{game.name}</b>
            <i>(Steam)</i>
          </a>
          {!showSetPlayer && (
            <div className="flex center">
              <div className="test2">
              votes: {game.votes ? game.votes : "0"}
              </div>
              <Button id={game.appid} className="mx-2" onClick={voteForSteamGame}>Vote</Button>
            </div>
          )}
          {!game.minPlayers && !game.maxPlayers && showSetPlayer &&
            (<div className="col-2">
              <div className="">
                <Button onClick={() => { setPlayerModal(true); setOpenGame(game) }}>Set Players</Button>
              </div>
            </div>)
          }

          {game.minPlayers && game.maxPlayers &&
            (<div className="col-2">
              <div className="">
                {game.minPlayers}-{game.maxPlayers} players
              </div>
            </div>)
          }
          {/* Preferred min: Preferred max: player */}
          <a className="col-3 flex center" href={`steam://run/${game.appid}//`} target='_blank' rel="noreferrer">
            <i className="col-auto flex center">
              Open in Steam
              <FontAwesomeIcon size="2x" className="px-2" icon={faPlayCircle} />
            </i>
          </a>
        </div>)
      }
    </div >
  );
}

