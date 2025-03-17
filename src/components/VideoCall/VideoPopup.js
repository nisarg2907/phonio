'use client';
import { useState, useEffect, useRef } from 'react';
import '@/styles/videopopup.css';

export default function VideoPopup({ onClose }) {
  const popupRef = useRef(null);
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const [localStream, setLocalStream] = useState(null);
  
  useEffect(() => {
    const buildTime = document.querySelector('meta[name="build-time"]')?.content;
    if (buildTime) {
      console.log(`Page last built at: ${buildTime}`);
    }

    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      const getMedia = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          });
          setLocalStream(stream);
        } catch (err) {
          console.error("Failed to get media:", err);
        }
      };
      
      getMedia();
      
      return () => {
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, []);

  const handleMouseDown = (e) => {
    if (popupRef.current && !isPiP) {
      setIsDragging(true);
      const rect = popupRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && popupRef.current) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const togglePiP = () => {
    setIsPiP(!isPiP);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      className={`video-popup ${isPiP ? 'pip-mode' : ''}`}
      style={isPiP ? { position: 'fixed', bottom: '20px', right: '20px' } : 
        { left: `${position.x}px`, top: `${position.y}px` }}
      ref={popupRef}
    >
      <div 
        className="video-popup-header"
        onMouseDown={handleMouseDown}
      >
        <h3>Video Call</h3>
        <div className="video-popup-controls">
          <button onClick={togglePiP} className="pip-button">
            {isPiP ? 'Expand' : 'PiP'}
          </button>
          <button onClick={onClose} className="close-button">×</button>
        </div>
      </div>
      
      <div className="video-container">
        {localStream && (
          <video
            className="local-video"
            autoPlay
            muted
            ref={(video) => {
              if (video && localStream) video.srcObject = localStream;
            }}
          />
        )}
        <div className="remote-videos-placeholder">
          {!localStream && <div className="video-placeholder">Camera access required</div>}
        </div>
      </div>
      
      <div className="video-controls">
        <button 
          onClick={toggleMute} 
          className={`control-button ${isMuted ? 'muted' : ''}`}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
        <button 
          onClick={toggleVideo} 
          className={`control-button ${isVideoOff ? 'video-off' : ''}`}
        >
          {isVideoOff ? '📷' : '📹'}
        </button>
      </div>
    </div>
  );
}