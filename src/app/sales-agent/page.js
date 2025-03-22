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
import { useEffect, useState, Suspense } from 'react';
import { Track } from 'livekit-client';
import { useSearchParams } from 'next/navigation';
import '@/styles/room-page.css';

function SalesAgentRoom() {
  const searchParams = useSearchParams();
  const roomParam = searchParams.get('room');
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [checkingRoom, setCheckingRoom] = useState(false);
  const [roomExists, setRoomExists] = useState(false);

  useEffect(() => {
    if (roomParam) {
      setRoom(roomParam);
      checkRoomExists(roomParam);
    } else {
      setRoom(`room-${Math.floor(Math.random() * 10000)}`);
    }
  }, [roomParam]);

  const checkRoomExists = async (roomName) => {
    setCheckingRoom(true);
    try {
      const resp = await fetch(`/api/check-room?room=${roomName}`);
      if (!resp.ok) throw new Error(`Failed to fetch room: ${resp.status} ${resp.statusText}`);
      const data = await resp.json();
      setRoomExists(data.exists);
    } catch (e) {
      console.error('Failed to check room:', e.message);
      setRoomExists(false);
    } finally {
      setCheckingRoom(false);
    }
  };

  const joinRoom = async () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (roomParam && !roomExists) {
      alert('Room does not exist');
      return;
    }

    try {
      const resp = await fetch(`/api/token?room=${room}&username=${name}`);
      const data = await resp.json();
      setToken(data.token);
      setIsJoined(true);
    } catch (e) {
      console.error('Failed to join room:', e);
    }
  };

  const createRoom = async () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    const roomLink = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/sales-agent?room=${room}`;
    navigator.clipboard?.writeText(roomLink);
    alert(`Room link copied to clipboard: ${roomLink}`);
    joinRoom();
  };

  const leaveRoom = () => {
    setIsJoined(false);
    setToken('');
  };

  if (!isJoined) {
    if (!room) return <div>Loading...</div>;

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
        {!roomParam && (
          <div className="form-group">
            <label>Room ID:</label>
            <div className="form-row">
              <input 
                type="text" 
                value={room} 
                readOnly 
                className="form-input"
              />
            </div>
          </div>
        )}
        <div className="button-group">
          {!roomParam ? (
            <button onClick={createRoom} className="join-button">
              Create Room
            </button>
          ) : (
            <button 
              onClick={joinRoom} 
              className="join-button"
              disabled={roomParam && !checkingRoom && !roomExists}
            >
              {checkingRoom ? 'Checking...' : 'Join Room'}
            </button>
          )}
        </div>
        {roomParam && !checkingRoom && !roomExists && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>Room does not exist</p>
        )}
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
      onDisconnected={leaveRoom}
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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SalesAgentRoom />
    </Suspense>
  );
}
