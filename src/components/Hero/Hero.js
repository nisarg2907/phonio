'use client';
import '@/styles/hero.css';

export default function Hero() {
  return (
    <div className="hero-container">
      <div className="sidebar">
        <div className="sidebar-column">
          <div className="sidebar-item">Buttons</div>
          <div className="sidebar-item">Components</div>
          <div className="sidebar-item">Transitions</div>
          <div className="sidebar-item">Animations</div>
          <div className="sidebar-item">Loaders</div>
        </div>
        <div className="sidebar-column">
          <div className="sidebar-item">Documentation</div>
          <div className="sidebar-item">Tools</div>
          <div className="sidebar-item">References</div>
          <div className="sidebar-item">Tutorials</div>
        </div>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">
          Start building websites
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