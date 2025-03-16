'use client';
import '@/styles/sidebar.css';

export default function Sidebar() {
  return (
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
  );
}