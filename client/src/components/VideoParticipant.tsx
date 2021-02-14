import React, { useState, useEffect, useRef } from 'react';

const VideoParticipant = ({ participant }: any) => {
  const [videoTracks, setVideoTracks] = useState([] as any[]);
  const [audioTracks, setAudioTracks] = useState([] as any[]);
  const videoRef = useRef<HTMLVideoElement>({} as any) as React.RefObject<HTMLVideoElement>;
  const audioRef = useRef<HTMLAudioElement>({} as any) as React.RefObject<HTMLVideoElement>

  const trackpubsToTracks = (trackMap: any) => Array.from(trackMap.values())
      .map((publication: any) => publication.track)
      .filter((track: any) => track !== null);

  useEffect(() => {
    const trackSubscribed = (track: any) => {
      if (track.kind === 'video') {
        setVideoTracks((videoTracks: any) => [...videoTracks, track]);
      } else {
        setAudioTracks((audioTracks: any) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track: any) => {
      if (track.kind === 'video') {
        setVideoTracks((videoTracks: any)  => videoTracks.filter((v: any) => v !== track));
      } else {
        setAudioTracks((audioTracks: any) => audioTracks.filter((a: any) => a !== track));
      }
    };

    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="participant">
      <h5>{participant.identity}</h5>
      <video ref={videoRef} autoPlay={true} className='video'/>
      <audio ref={audioRef} autoPlay={true} muted={true} />
    </div>
  );
};

export default VideoParticipant;