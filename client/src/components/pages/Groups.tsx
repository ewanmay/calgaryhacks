import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/context';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { ServerMessage } from '../../context/types';

import { Button, FormControl, InputGroup } from 'react-bootstrap';

function Groups() {
  const [state, dispatch] = useContext(AppContext)
  const [lobbyCode, setLobbyCode] = useState('')
  const [inLobby, setInLobby] = useState(false)
  
  useEffect(() => {
    state.socket.on('chat-message', (msg: ServerMessage) => {
      console.log('MY USERNAME: ' + state.authState.username)
      console.log('got chat msg', msg)
      if(state.authState.username !== msg.username){
        addResponseMessage(formattedServerMessage(msg))
      }
    })
  }, [])

  const handleNewUserMessage = (newMessage: string) => {
    console.log(`New message sending out: ${newMessage}`);
    state.socket.emit('add-chat-message', {messageContents: newMessage, username: state.authState.username})
  }

  const formattedServerMessage: (msg: ServerMessage) => string = (msg: ServerMessage) => {
    return "###" + msg.username + "<br>" + msg.messageContents;
    // return msg.messageContents
  }

  const createLobby = () => {
    // Ask server to create lobby
    state.socket.emit('create-lobby', {username: state.authState.username});

    // Once created, set lobby code and change what we display somehow
    state.socket.once('join-lobby-err', (msg: any) => console.log(msg)) // TODO
    state.socket.once('joined-lobby', (res: any) => {
      setInLobby(true)
      setLobbyCode(res.lobbyCode)
    })
  }

  const joinLobby = () => {
    state.socket.emit('join-lobby', {username: state.authState.username, lobbyCode})
    console.log("Clicked join lobby")
    state.socket.once('join-lobby-err', (msg: any) => console.log(msg)) // TODO
    state.socket.once('joined-lobby', ({ lobbyCode, users }: any) => {
      if(!lobbyCode) {
        
      }
      setInLobby(true)
      console.log("LobbyCode: ", lobbyCode)
    })
  }

  return (
    <div id="groups" className="fill flex center">

      {!inLobby && (
        <div className="col-6 p-0">
          <div id="groups-create-lobby">
            <Button onClick={() => createLobby()}>Create Lobby</Button>
          </div>

          <div id="groups-join-lobby">
            <InputGroup className="mb-3">
                <FormControl
                  placeholder="Lobby Code"
                  className="col-12"
                  aria-label="Lobby Code"
                  aria-describedby="basic-addon1"
                  onChange={(value: ChangeEvent<any>) => setLobbyCode(value.target.value)}
                />
              </InputGroup>
            <Button onClick={() => joinLobby()}>Join Lobby</Button>
          </div>
        </div>
      )}
      {inLobby && (
        <>
        <p>
          You are in the lobby {lobbyCode}
        </p>
        <Widget 
          handleNewUserMessage={handleNewUserMessage}
          handleSubmit={(message: string) => {}}
          showTimeStamp = {true}
          />
        </>
      )}
      

      
    </div>
  );
}

export default Groups;
