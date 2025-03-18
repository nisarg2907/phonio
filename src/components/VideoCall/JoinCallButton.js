'use client';

import { useState } from 'react';
import VideoCallPopup from './VideoPopup';
import '@/styles/join-call-button.css'

export default function JoinCallButton() {
  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState(`room-${Math.floor(Math.random() * 10000)}`);

  const handleJoinCall = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter your name');
      return;
    }
    setShowPopup(true);
    setShowForm(false);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <button 
        onClick={() => setShowForm(true)}
        className="join-call-button"
      >
        Join Call
      </button>

      {showForm && (
        <div className="form-modal">
          <h3>Join Video Call</h3>
          <form onSubmit={handleJoinCall}>
            <div className="form-group">
              <label>Your Name:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Room ID:</label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="join-button"
              >
                Join
              </button>
            </div>
          </form>
        </div>
      )}

      {showPopup && (
        <VideoCallPopup
          roomId={roomId}
          username={username}
          onClose={closePopup}
        />
      )}
    </>
  );
}