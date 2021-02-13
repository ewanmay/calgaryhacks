import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { AppContext } from '../../context/context';

function Profile() {
  const [state, dispatch] = useContext(AppContext)
  const [steamId, setSteamId] = useState("")

  useEffect(() => {
  }, [])


  const connectSteamId = () => {
    state.socket.emit("add-steamid", steamId)
  }


  return (
    <div className="">
      {state.profile.steam.steamUsername.length === 0 && (<InputGroup className="mb-3">
        Connect steam ID 
        <FormControl
          placeholder="Steam ID"
          aria-label="Steam ID"
          aria-describedby="basic-addon2"
          onChange={(value: ChangeEvent<any>) => setSteamId(value.target.value)}
        />
        <Button onClick={connectSteamId}>Connect</Button>
      </InputGroup>)}
    </div>

  );
}

export default Profile;
