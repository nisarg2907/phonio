'use client';

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import { Track } from 'livekit-client';
import { useSearchParams } from 'next/navigation';
import '@/styles/room-page.css';

export default function Page() {
  const searchParams = useSearchParams();
  const roomParam = searchParams.get('room');
  const [room, setRoom] = useState(roomParam || '');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (!room) {
      const randomRoom = `room-${Math.floor(Math.random() * 10000)}`;
      setRoom(randomRoom);
    }
  }, [room]);

  const joinRoom = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    
    try {
      const resp = await fetch(`/api/token?room=${room}&username=${name}`);
      const data = await resp.json();
      setToken(data.token);
      setIsJoined(true);
    } catch (e) {
      console.error(e);
    }
  };

  const shareRoomLink = () => {
    const roomLink = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/sales-agent?room=${room}`;
    navigator.clipboard.writeText(roomLink);
    alert(`Room link copied to clipboard: ${roomLink}`);
  };

  if (!isJoined) {
    return (
      <div className="join-container">
        <h2>Sales Agent Video Call</h2>
        <div className="form-group">
          <label>Your Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Room ID:</label>
          <div className="form-row">
            <input 
              type="text" 
              value={room} 
              onChange={e => setRoom(e.target.value)} 
              className="form-input"
            />
            <button onClick={shareRoomLink} className="share-button">
              Share Room
            </button>
          </div>
        </div>
        <button 
          onClick={joinRoom} 
          className="join-button"
        >
          Join Call
        </button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      className="livekit-container"
    >
      <MyVideoConference />
      <RoomAudioRenderer />
      <ControlBar />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} className="video-grid">
      <ParticipantTile />
    </GridLayout>
  );
}