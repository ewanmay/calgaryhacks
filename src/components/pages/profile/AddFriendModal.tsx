import React, { ChangeEvent, useContext, useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { AppContext } from '../../../context/context';

interface AddFriendModalProps {
  close: () => void
}

function AddFriendModal({ close }: AddFriendModalProps) {
  const [state, dispatch] = useContext(AppContext)
  const [friendName, setFriendName] = useState("")

  const addFriend = () => {
    state.socket.emit("send-friend-request", state.authState.username, friendName)
    close()
  }

  return (
    <div className="modal-background flex center">
      <div className="modal flex center column">
        <div className="modal-header">
          Add Friend
        </div>
        <div className="modal-body">
          Enter their username below
        </div>
        <div className="error-message">
          {state.profile.steam.steamError}
        </div>
        <InputGroup className="mb-3 flex center">
          <FormControl
            placeholder="Friend Username"
            aria-label="Friend Username"
            className="col-8"
            aria-describedby="basic-addon2"
            onChange={(value: ChangeEvent<any>) => setFriendName(value.target.value)}
          />
          <div className="col-12 p-0">
            <Button variant="secondary" onClick={() => close()}>Close</Button>
            <Button className="m-3" onClick={addFriend}>Send</Button>
          </div>
        </InputGroup>
      </div>
    </div>
  )
}

export default AddFriendModal;
