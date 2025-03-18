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

export default function Page() {
  const searchParams = useSearchParams();
  // Get room from URL parameters or generate a random one
  const roomParam = searchParams.get('room');
  const [room, setRoom] = useState(roomParam || '');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  // Generate a random room ID if none is provided
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
    const roomLink = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/room?room=${room}`;
    navigator.clipboard.writeText(roomLink);
    alert(`Room link copied to clipboard: ${roomLink}`);
  };

  if (!isJoined) {
    return (
      <div className="join-container" style={{ maxWidth: '500px', margin: '100px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h2>Sales Agent Video Call</h2>
        <div style={{ marginBottom: '20px' }}>
          <label>Your Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Room ID:</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={room} 
              onChange={e => setRoom(e.target.value)} 
              style={{ flex: 1, padding: '8px', marginTop: '5px' }}
            />
            <button onClick={shareRoomLink} style={{ marginTop: '5px', padding: '8px 15px' }}>
              Share Room
            </button>
          </div>
        </div>
        <button 
          onClick={joinRoom} 
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}
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
      style={{ height: '100dvh' }}
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
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
}