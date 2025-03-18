'use client';

import { useState } from 'react';
import VideoCallPopup from './VideoPopup';

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
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Join Call
      </button>

      {showForm && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
          zIndex: 9998,
          maxWidth: '400px',
          width: '100%'
        }}>
          <h3>Join Video Call</h3>
          <form onSubmit={handleJoinCall}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Your Name:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Room ID:</label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#ccc',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
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