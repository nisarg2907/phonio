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
  }, [isDragging, dragOffset]);

  if (!token) {
    return <div className="popup">Loading call...</div>;
  }

  return (
    <div 
      ref={popupRef}
      className="video-call-popup"
      style={{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: 9999,
        background: 'white',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      <div 
        className="popup-header"
        onMouseDown={handleMouseDown}
        style={{
          background: '#2c3e50',
          color: 'white',
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>Video Call: Room {roomId}</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={togglePiP}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            {isPiP ? 'Expand' : 'PiP'}
          </button>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      </div>
      
      <div style={{ flex: 1, position: 'relative' }}>
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          style={{ height: '100%' }}
        >
          <VideoConferenceComponent />
          <RoomAudioRenderer />
          <ControlBar style={{ position: 'absolute', bottom: 0, width: '100%' }} />
        </LiveKitRoom>
      </div>
      
      <div 
        className="resize-handle"
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '20px',
          height: '20px',
          cursor: 'se-resize'
        }}
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