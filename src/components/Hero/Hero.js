'use client';
import '@/styles/hero.css';

export default function Hero() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">
          Start building websites<br />
          people remember.
        </h1>
        <div className="button-group">
          <button className="member-button">Become a member</button>
          <button className="about-button">
            <span className="avatar-group">👤👤</span>
            About us
          </button>
        </div>
        <p className="hero-description">
          Osmo came from constantly digging through old
          projects wondering, &#39;How did I build that again?&#39; It is
          basically our personal toolbox, packed with
          components, techniques, tricks and tutorials—and it
          will keep growing.
        </p>
      </div>
    </div>
  );
}