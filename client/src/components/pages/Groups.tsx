import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/context';
import { Widget, addResponseMessage, deleteMessages, renderCustomComponent } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { ServerMessage } from '../../context/types';
import Userlist from '../UserList'
import Chat from '../Chat';

import { Button, FormControl, InputGroup } from 'react-bootstrap';

import './Groups.css'

function Groups() {
  const [state, dispatch] = useContext(AppContext)
  const [lobbyCode, setLobbyCode] = useState('')
  const [inLobby, setInLobby] = useState(false)

  const createLobby = () => {
    // Ask server to create lobby

    // Once created, set lobby code and change what we display somehow
    state.socket.once('join-lobby-err', (msg: any) => console.log(msg)) // TODO
    state.socket.once('joined-lobby', (res: any) => {
      setInLobby(true)
      setLobbyCode(res.lobbyCode)
    })
    state.socket.emit('create-lobby', state.authState.username);
  }

  const joinLobby = () => {
    console.log("Clicked join lobby")
    state.socket.once('join-lobby-err', (msg: any) => console.log(msg)) // TODO
    state.socket.once('joined-lobby', ({ lobbyCode, users }: any) => {
      console.log("LobbyCode:", lobbyCode)
      setInLobby(true)
    })
    state.socket.emit('join-lobby', { username: state.authState.username, lobbyCode })
  }

  const leaveLobby = () => {
    console.log("leaving lobby")
    state.socket.emit('leave-lobby')

    setInLobby(false)
    setLobbyCode('')
  }

  return (
    <div className="fill flex center nowrap">

      {!inLobby && (
        <div className="col-6 p-0 flex center column">

          <div id="groups-join-lobby" className="mt-3">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Lobby Code"
                className="col-12"
                aria-label="Lobby Code"
                aria-describedby="basic-addon1"
                onChange={(value: ChangeEvent<any>) => setLobbyCode(value.target.value)}
              />
              <InputGroup.Append>
                <Button onClick={() => joinLobby()}>Join Lobby</Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
          OR
          <div id="groups-create-lobby" className="m-3">
            <Button onClick={() => createLobby()}>Create Lobby</Button>
          </div>
        </div>
      )}
      {inLobby && (
        <>
          <div id='groups'>
            <div id="groups-main">
              <div id="groups-left">
                <div className="p-3">
                  <Button onClick={() => leaveLobby()}>Leave Lobby</Button>
                  <b className="pl-3">Code:</b> {lobbyCode}
                </div>
                <Userlist />
                {/* List of users in lobby? */}
              </div>
              <div id="groups-middle">
                {/* Available game options + randomly selected game to play */}
              </div>
              <div id="groups-right">
                <Chat />
              </div>
            </div>
          </div>
        </>
      )}



    </div>
  );
}

export default Groups;
