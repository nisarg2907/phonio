'use client';
import '@/styles/sales-agent.css';
import '@/styles/videopopup.css'; 
import { useState, useEffect, useRef } from 'react';


export default function SalesAgentPage() {
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  useEffect(() => {
    // Get local media streams when component mounts
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
      
      // Clean up function
      return () => {
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, []);

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

  return (
    <div className="sales-agent-page">
      <h1>Sales Agent Dashboard</h1>
      
      <div className="video-container full">
        {localStream ? (
          <video
            className="local-video-full"
            autoPlay
            muted
            ref={(video) => {
              if (video && localStream) video.srcObject = localStream;
            }}
          />
        ) : (
          <div className="video-placeholder">Loading camera...</div>
        )}
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