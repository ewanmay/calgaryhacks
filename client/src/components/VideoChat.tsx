import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/context';
import Video from 'twilio-video';
import { Button } from 'react-bootstrap';
import VideoParticipant from './VideoParticipant'
interface Props {
  roomName: string
}

const VideoChat = ({ roomName }: Props) => {
  const [state, dispatch] = useContext(AppContext)
  const [room, setRoom] = useState(null as any);
  const [participants, setParticipants] = useState([] as any[]);
  const [token, setToken] = useState('')
  
  useEffect(() => {
    const participantConnected = (participant: any) => {
      setParticipants((prevParticipants: any) => [...prevParticipants, participant]);
    };
    const participantDisconnected = (participant: any) => {
      setParticipants((prevParticipants: any) =>
        prevParticipants.filter((p: any) => p !== participant)
      );
    };
    Video.connect((token), {
      name: roomName
    }).then((room: any) => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom((currentRoom: any) => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function (trackPublication: any) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  const leaveVideo = () => {
    setToken("");
  };

  const getToken = () => {
    state.socket.on('token', (token: any) => {
      console.log("got token:", token)
      setToken(token);
    })
    state.socket.emit('get-token', state.authState.username)
  };


  const remoteParticipants = participants.map((participant: any) => (
    <VideoParticipant key={participant.sid} participant={participant} />
  ));


  if (token) {
    return (
      <div id='video-chat-container'>  
        <div id='video-chat'>
          {room && (
            <VideoParticipant
              key={room?.localParticipant?.sid}
              participant={room?.localParticipant}
            />
          )}          
          {remoteParticipants}
        </div>
        <div className="col-1">
          <Button onClick={leaveVideo}>Leave Video</Button>
        </div>
      </div>
    );
  }
  else {
    return (      
      <Button onClick={getToken}>Join Video</Button>
    )
  }
}

export default VideoChat
