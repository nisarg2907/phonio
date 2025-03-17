'use client';
import '@/styles/hero.css';
import Image from 'next/image';

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
                    <button className="become-member-button" data-text="Become a member">
                        <span>Become a member</span>
                    </button>

                    <button className="about-us-button">
                        <span className="avatar-icons">
                            <Image loading="lazy" src="https://cdn.prod.website-files.com/6708f85ff3d3cba6aff436fb/67792689c6fdc72c7e6abfa1_button-faces.png" alt="Dennis Snellenberg and Ilja van Eck" height={42} width={74} />
                        </span>
                        <span className="about-us-text" data-text="About us">
                            <span>About us</span>
                        </span>
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