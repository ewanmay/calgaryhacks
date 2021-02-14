import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { AppContext } from '../../context/context';
import { Game } from '../../context/types';
import ConnectSteamModal from './ConnectSteamModal';
import './Profile.css';
import SetPlayerModal from './SetPlayerModal';

function Profile() {
  const [state, dispatch] = useContext(AppContext)
  const [steamId, setSteamId] = useState("")
  const [showSteamModal, setShowModal] = useState(false)
  const [showPlayerModal, setPlayerModal] = useState(false)
  const [openGame, setOpenGame] = useState({} as Game)
  const steam = state.profile.steam

  const refreshUser = () => {
    state.socket.emit("get-steam-info", state.authState.username)
  }

  useEffect(() => {
    state.socket.emit("get-steam-info", state.authState.username)
  }, [])

  return (
    <div className="fill col-12 p-0 flex center column">
      {steam.steamUsername.length === 0 && (<Button onClick={() => setShowModal(true)}>Connect Steam Account</Button>)}
      {steam.steamUsername.length !== 0 && steam.games.length === 0 && (
        <div className="col-12 p-0">
          Steam account connected, but no games found. Make sure "Game details" is set to Public.
          You can find your game privacy settings <a href={`https://steamcommunity.com/profiles/${state.profile.steam.steamId}/edit/settings`}>here</a>.
          <Button className="m-2" onClick={() => { refreshUser() }}>Refresh profile</Button>
        </div>
      )}
      {showSteamModal && (<ConnectSteamModal close={() => { setShowModal(false) }}></ConnectSteamModal>)}
      {showPlayerModal && (<SetPlayerModal game={openGame} close={() => setPlayerModal(false)}></SetPlayerModal>)}
      {steam.games.length > 0 && (
        <div className="col-12 p-0 flex fill center left column">
          <h4 className="p-1">
            Your Multiplayer Games
          </h4>
          <div className="col-6 p-0 game-container left">
            {state.profile.steam.games.map((game: Game) => {
              return (
                <div className="col-12 px-0 game-list-item cursor flex space-between">
                  <a className="col-3" href={game.website} target="_blank" rel="noreferrer">
                    <b>{game.name}</b>
                    <i> (Steam)</i>
                  </a>
                  <div className="col-3 flex center">
                    {game.minPlayers && game.maxPlayers &&
                      (<div className="">
                        {game.minPlayers}-{game.maxPlayers} players
                      </div>)
                    }
                    {!game.minPlayers && !game.maxPlayers &&
                      (<div className="">
                        <Button onClick={() => { setOpenGame(game); setPlayerModal(true) }}>Set Players</Button>
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
              )
            })}
          </div>
        </div>)}
    </div>

  );
}

export default Profile;
