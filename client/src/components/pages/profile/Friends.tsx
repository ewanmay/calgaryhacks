import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { AppContext } from '../../../context/context';
import { faCheck, faPlus, faTimes, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FriendRequest } from '../../../context/types';

interface FriendsProps {
  setShowFriendModal: any
}
// get-steam-info

export default function Friends({ setShowFriendModal }: FriendsProps) {
  const [state, dispatch] = useContext(AppContext)

  useEffect(() => {
    state.socket.emit("get-outgoing-friend-requests", state.authState.username)
    state.socket.emit("get-incoming-friend-requests", state.authState.username)
  }, [])

  const onAccept = (request: FriendRequest) => {
    state.socket.emit("accept-friend-request", request.id)
  }


  const deleteRequest = (request: FriendRequest) => {
    state.socket.emit("delete-friend-request", request.id, state.authState.username)
  }

  return (
    <div className="col-12 p-0 center top flex">
      <div className="col-6 p-0 flex top center">
        <h5 className="m-0">Friends List</h5>
        {state.profile.friends.map(friend =>
          <div className="col-12 p-0">
            {friend?.username}
          </div>)}
        <div className="col-auto cursor flex center" onClick={() => setShowFriendModal(true)} style={{ color: "lightgreen" }}>
          Add Friend <FontAwesomeIcon className="mx-2" icon={faPlus}></FontAwesomeIcon>
        </div>
      </div>
      <div className="col-6 p-0 flex column center">
        <h5 className="m-0"> Friend Requests</h5>
        <div className="col-4 p-0 flex">

          <div className="col-6 flex column">

            <h6> Incoming </h6>
            {state.profile.incomingRequests.map(request => (
              <div>
                {request.sending}
                <FontAwesomeIcon onClick={() => onAccept(request)} style={{ color: "lightgreen" }} className="cursor mx-2" icon={faCheck} />
                <FontAwesomeIcon onClick={() => deleteRequest(request)} style={{ color: "lightred" }} icon={faTimes} className="cursor" />
              </div>
            ))}
          </div>
          <div className="col-6">
            <h6> Outgoing </h6>
            {state.profile.outgoingRequests.map(request => (
              <div>
                {request.receiving}
                <FontAwesomeIcon onClick={() => deleteRequest(request)} style={{ color: "lightred" }} icon={faMinusCircle} className="cursor mx-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

