import React, { ChangeEvent, RefObject, useContext, useRef, useState, useEffect } from 'react';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import 'react-chat-widget/lib/styles.css';
import { AppContext } from '../../../context/context';
import Chat from '../../Chat';
import Userlist from '../../UserList';
import VideoChat from '../../VideoChat';
import CommonGames from '../CommonGames';
import './Groups.css';
import GameItem from '../GameItem';
import { Game } from '../../../context/types';

function Groups() {
  const [state, dispatch] = useContext(AppContext)
  const [lobbyCode, setLobbyCode] = useState('')
  const [inLobby, setInLobby] = useState(false)
  const [mostVotedGame, setMostVotedGame] = useState({} as Game)
  const [videoOn, setVideoOn] = useState(false)
  const inputRef = useRef({}) as RefObject<HTMLInputElement>

  useEffect(() => {
    return () => leaveLobby() // leave lobby on unmount    
  }, [])

  useEffect(() => {
    let allGames = state.commonGames.steamGames.concat(state.commonGames.epicGames)
    allGames = allGames.concat(state.commonGames.freeGames)
    const max = allGames.filter(o => o.votes).reduce((prev: Game, current: Game) => ((prev?.votes?.length || 0) > (current?.votes?.length || 0)) ? prev : current, allGames[0])
    setMostVotedGame(max);
  }, [state.commonGames.epicGames, state.commonGames.freeGames, state.commonGames.steamGames])

  const createLobby = () => {
    // Ask server to create lobby

    // Once created, set lobby code and change what we display somehow
    state.socket.once('join-lobby-err', (msg: any) => console.log(msg)) // TODO
    state.socket.once('joined-lobby', (res: any) => {
      setInLobby(true)
      setLobbyCode(res.lobbyCode)
    })
    state.socket.emit('create-lobby', state.authState.username);
    state.socket.emit('get-games')
  }

  const joinLobby = () => {
    console.log("Clicked join lobby")
    state.socket.once('join-lobby-err', (msg: any) => console.log(msg)) // TODO
    state.socket.once('joined-lobby', ({ lobbyCode, users }: any) => {
      console.log("LobbyCode:", lobbyCode)
      setInLobby(true)
    })
    state.socket.emit('join-lobby', { username: state.authState.username, lobbyCode })
    state.socket.emit('get-games')
  }

  const leaveLobby = () => {
    console.log("leaving lobby")
    state.socket.emit('leave-lobby', state.authState.username)
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
                ref={inputRef}
                onChange={(value: ChangeEvent<any>) => {
                  if (inputRef && inputRef.current) {
                    inputRef.current.value = value.target.value.toUpperCase()
                  }
                  setLobbyCode(value.target.value.toUpperCase())
                }}
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
            <VideoChat roomName={lobbyCode} setVideoOn={setVideoOn}/>
            <div id="groups-main">
              <div id="groups-left">
                <div className="p-3">
                  <div className='flex row' style={{ alignItems: 'center' }}>
                    <Button onClick={() => leaveLobby()}>Leave Lobby</Button>
                    <b className="pl-3" id='code' style={{ fontFamily: 'monospace', fontSize: 17 }}>Code: {lobbyCode}</b>
                    <div className='pointer' onClick={() => { navigator.clipboard.writeText(lobbyCode) }}>
                      <FontAwesomeIcon icon={faClipboard} style={{ marginLeft: 5 }}></FontAwesomeIcon>
                    </div>
                  </div>
                </div>
                <Userlist />
              </div>
              <div id="groups-middle" style={{maxHeight: videoOn ? '40vh' : '80vh'}}>
                <CommonGames />
                {mostVotedGame?.appid && mostVotedGame?.votes && mostVotedGame?.votes?.length > 0 && (
                  <div>
                    Highest voted:
                    <GameItem game={mostVotedGame}></GameItem>
                  </div>)}
              </div>
              <div id="groups-right">
                <h5>Chat</h5>
                <Chat videoOn={videoOn}/>
              </div>
            </div>
          </div>
        </>
      )}



    </div>
  );
}

export default Groups;
