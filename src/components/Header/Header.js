// 'use client';
// import '@/styles/header.css';
// import { useState } from 'react';

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <header className="header">
//       <div className="logo-container">
//         <div className="logo">Osmo</div>
//         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 160 160" fill="none" className="logo-icon">
//           <path d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z" fill="currentColor"></path>
//         </svg>
//       </div>
//       <nav className={`navigation ${menuOpen ? 'open' : ''}`}>
//         <a href="#" className="nav-item active">Home</a>
//         <a href="#" className="nav-item">Pricing</a>
//         <a href="#" className="nav-item">Updates<sup>58</sup></a>
//         <a href="#" className="nav-item">FAQ</a>
//       </nav>
//       <div className="auth-buttons">
//         <button className="login-button">Log in</button>
//         <button className="get-started-button">Get Started</button>
//         <button className="menu-button" onClick={() => {setMenuOpen(!menuOpen)
//             console.log("clicked")
//         }}>+</button>
//       </div>
//     </header>
//   );
// }
'use client';
import '@/styles/header.css';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo">Osmo</div>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 160 160" fill="none" className="logo-icon">
          <path d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z" fill="currentColor"></path>
        </svg>
      </div>
      <nav className={`navigation ${menuOpen ? 'open' : ''}`}>
        <a href="#" className="nav-item active" data-text="Home"><span>Home</span></a>
        <a href="#" className="nav-item" data-text="Pricing"><span>Pricing</span></a>
        <a href="#" className="nav-item" data-text="Updates"><span>Updates<sup>58</sup></span></a>
        <a href="#" className="nav-item" data-text="FAQ"><span>FAQ</span></a>
      </nav>
      <div className="auth-buttons">
        <button className="login-button" data-text="Log in"><span>Log in</span></button>
        <button className="get-started-button" data-text="Get Started"><span>Get Started</span></button>
        <button className="menu-button" onClick={() => {setMenuOpen(!menuOpen)}}>+</button>
      </div>
      
      {menuOpen && (
        <div className="mobile-menu">
          <a href="#" className="mobile-nav-item active">Home</a>
          <a href="#" className="mobile-nav-item">Pricing</a>
          <a href="#" className="mobile-nav-item">Updates<sup>58</sup></a>
          <a href="#" className="mobile-nav-item">FAQ</a>
        </div>
      )}
    </header>
  );
}