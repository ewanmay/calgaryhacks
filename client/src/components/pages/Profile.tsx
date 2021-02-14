import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { AppContext } from '../../context/context';
import { Game } from '../../context/types';
import ConnectSteamModal from './ConnectSteamModal';
import './Profile.css';

function Profile() {
  const [state, dispatch] = useContext(AppContext)
  const [steamId, setSteamId] = useState("")
  const [showSteamModal, setShowModal] = useState(false)
  const steam = state.profile.steam

  useEffect(() => {
    state.socket.emit("get-steam-info", state.authState.username)
  }, [])

  return (
    <div className="fill col-12 p-0 flex center column">
      {steam.steamUsername.length === 0 && (<Button onClick={() => setShowModal(true)}>Connect Steam Account</Button>)}
      {showSteamModal && (<ConnectSteamModal close={() => {setShowModal(false)}}></ConnectSteamModal>)}
      {steam.games.length > 0 && (
        <div className="col-12 p-0 flex center left column">
          <h4>
            Your Multiplayer Games
          </h4>
          <div className="col-6 p-0 game-container left ">
            {state.profile.steam.games.map((game: Game) => {
              return (
                <div className="col-12 px-0 game-list-item cursor">
                  <a href={game.website} target="_blank" rel="noreferrer">
                    {game.name}                    
                    <i> (Steam)</i>
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
