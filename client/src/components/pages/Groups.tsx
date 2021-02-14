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

  // const handleGotMessage = (msg: ServerMessage) => {
  //     // console.log('MY USERNAME: ' + state.authState.username)
  //     console.log('got chat msg', msg)
  //     // if(state.authState.username !== msg.username){
  //       addResponseMessage(extractMsg(msg))//, msg.username)
        
  //       //@ts-ignore
  //       // renderCustomComponent(CustomMessageComponent(msg), {}, false)
  //     // }
  //   }
  
  useEffect(() => {
    state.socket.off('chat-message');
    state.socket.on('chat-message', (msg: ServerMessage) => {
      console.log('got chat msg', msg)
      addResponseMessage(extractMsg(msg))//, msg.username)
      //@ts-ignore
      renderCustomComponent(CustomMessageComponent(msg), {}, false)
    })
    return () => deleteMessages(99999999)
  }, [state.socket])
  
  const extractMsg = (msg: ServerMessage): string => {
    return msg.messageContents
  }

  const handleNewUserMessage = (newMessage: string) => {
    console.log(`New message sending out: ${newMessage}`);
    state.socket.emit('add-chat-message', {messageContents: newMessage, username: state.authState.username})
  }

  const CustomMessageComponent = (msg: ServerMessage) => {
    return (
      <div>
        msg.username
        <br />
      <div>
          msg.messageContents
        </div>
      </div>
    )
  }


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
    state.socket.emit('join-lobby', {username: state.authState.username, lobbyCode})
  }

  const leaveLobby = () =>{
    console.log("leaving lobby")
    state.socket.emit('leave-lobby')

    setInLobby(false)
    setLobbyCode('')
  }
  
  return (
    <div className="fill flex center nowrap">

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
        <div id='groups'>
          <div id="groups-top">
            <div>
              <b>Code:</b> {lobbyCode}
            </div>
            <Button onClick={() => leaveLobby()}>Leave Lobby</Button>
          </div>
          <div id = "groups-main">
            <div id="groups-left">
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
          {/* <Widget 
            handleNewUserMessage={(message: string) => {}}
            handleSubmit={handleNewUserMessage}
            showTimeStamp = {true}
            title="Group Chat"
            subtitle = {"Lobby: " + lobbyCode}
          /> */}
          </div>
        </>
      )}
      

      
    </div>
  );
}

export default Groups;
