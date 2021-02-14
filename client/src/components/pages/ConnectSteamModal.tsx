import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { AppContext } from '../../context/context';

interface ConnectSteamModalProps {
  close: any
}

function ConnectSteamModal({ close }: ConnectSteamModalProps) {
  const [state, dispatch] = useContext(AppContext)

  const [steamId, setSteamId] = useState("")
  const connectSteamId = () => {
    state.socket.emit("add-steamid", state.authState.username, steamId)
  }

  useEffect(() => {
  }, [])
  return (
    <div className="modal-background">
      <div className="modal flex center">
        <div className="modal-header">
          Connect Steam ID
      </div>
        <div className="error-message">
          {state.profile.steam.steamError}

        </div>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Steam ID"
            aria-label="Steam ID"
            aria-describedby="basic-addon2"
            onChange={(value: ChangeEvent<any>) => setSteamId(value.target.value)}
          />
          <div className="col-12 p-0">
            <Button className="m-3" onClick={connectSteamId}>Connect</Button>
            <Button variant="secondary" onClick={() => close()}>Close</Button>
          </div>
        </InputGroup>
      </div>
    </div>
  )
}

export default ConnectSteamModal;