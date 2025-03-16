'use client';
import { useState } from 'react';
import VideoPopup from './VideoPopup';
import '@/styles/videopopup.css';

export default function JoinCallButton() {
  const [showVideoCall, setShowVideoCall] = useState(false);
  
  return (
    <>
      <button 
        className="join-call-button"
        onClick={() => setShowVideoCall(true)}
      >
        Join Call
      </button>
      
      {showVideoCall && (
        <VideoPopup onClose={() => setShowVideoCall(false)} />
      )}
    </>
  );
}