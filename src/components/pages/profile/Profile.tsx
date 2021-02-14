import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { AppContext } from '../../../context/context';
import { Game } from '../../../context/types';
import ConnectSteamModal from './ConnectSteamModal';
import './Profile.css';
import SetPlayerModal from './SetPlayerModal';
import GamesList from './GamesList';
import Friends from './Friends';
import AddFriendModal from './AddFriendModal';

function Profile() {
  const [state, dispatch] = useContext(AppContext)
  const [showSteamModal, setShowSteamModal] = useState(false)
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [showFriendModal, setShowFriendModal] = useState(false)
  const [openGame, setOpenGame] = useState({} as Game)
  const steam = state.profile.steam

  const refreshUser = () => {
    state.socket.emit("get-steam-info", state.authState.username)
  }

  useEffect(() => {
    state.socket.emit("get-steam-info", state.authState.username)
    state.socket.emit('get-friends', state.authState.username)
  }, [])

  return (
    <div className="fill col-12 p-0 flex center column">
      {steam.steamUsername.length === 0 && (<Button onClick={() => setShowSteamModal(true)}>Connect Steam Account</Button>)}
      {steam.steamUsername.length !== 0 && steam.games.length === 0 && (
        <div className="col-12 p-0">
          Steam account connected, but no games found. Make sure "Game details" is set to Public.
          You can find your game privacy settings
          <a href={`https://steamcommunity.com/profiles/${state.profile.steam.steamId}/edit/settings`} target='_blank' rel="noreferrer">
            {' '}here
          </a>.
          <Button className="m-2" onClick={() => { refreshUser() }}>Refresh profile</Button>
        </div>
      )}
      {showSteamModal && (<ConnectSteamModal close={() => { setShowSteamModal(false) }}></ConnectSteamModal>)}
      {showPlayerModal && (<SetPlayerModal game={openGame} close={() => setShowPlayerModal(false)}></SetPlayerModal>)}      
      {showFriendModal && (<AddFriendModal close={() => setShowFriendModal(false)}/>)}
      <div className="col-12 p-0 fill center">
        <Friends setShowFriendModal={setShowFriendModal}/>
      </div>
      {steam.games.length > 0 && (<GamesList setPlayerModal={setShowPlayerModal} setOpenGame={setOpenGame}></GamesList>)}
      {/* TODO add a refresh button to update your GamesList (refetch from steam) */}
      {/* TODO add a button to reset your steam ID */}
    </div>

  );
}

export default Profile;
