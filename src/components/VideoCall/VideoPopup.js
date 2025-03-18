'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import '@/styles/videopopup.css';

export default function VideoCallPopup({ roomId, username, onClose }) {
  const [token, setToken] = useState('');
  const popupRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPiP, setIsPiP] = useState(false);
  const [size, setSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const resp = await fetch(`/api/token?room=${roomId}&username=${username}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    };

    fetchToken();
  }, [roomId, username]);

  // Handle dragging functionality
  const handleMouseDown = (e) => {
    if (e.target.closest('.resize-handle')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle resizing functionality
  const handleResize = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    
    function onMouseMove(mouseMoveEvent) {
      const dx = mouseMoveEvent.clientX - startX;
      const dy = mouseMoveEvent.clientY - startY;
      
      if (direction === 'se') {
        setSize({
          width: Math.max(300, startWidth + dx),
          height: Math.max(200, startHeight + dy)
        });
      }
    }
    
    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Toggle Picture-in-Picture mode
  const togglePiP = () => {
    setIsPiP(!isPiP);
    if (!isPiP) {
      // Small size for PiP mode
      setSize({ width: 300, height: 200 });
    } else {
      // Return to normal size
      setSize({ width: 800, height: 600 });
    }
  };

  // Attach global mouse move and up events
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragOffset]);

  if (!token) {
    return <div className="popup">Loading call...</div>;
  }

  return (
    <div 
      ref={popupRef}
      className="video-call-popup"
    >
      <div 
        className="popup-header"
        onMouseDown={handleMouseDown}
      >
        <div>Video Call: Room {roomId}</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={togglePiP}
            className="header-button"
          >
            {isPiP ? 'Expand' : 'PiP'}
          </button>
          <button 
            onClick={onClose}
            className="header-button"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="video-container">
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
        >
          <VideoConferenceComponent />
          <RoomAudioRenderer />
          <ControlBar className="lk-control-bar" />
        </LiveKitRoom>
      </div>
      
      <div 
        className="resize-handle"
        onMouseDown={(e) => handleResize(e, 'se')}
      ></div>
    </div>
  );
}

function VideoConferenceComponent() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  
  return (
    <GridLayout tracks={tracks} style={{ height: '100%' }}>
      <ParticipantTile />
    </GridLayout>
  );
}