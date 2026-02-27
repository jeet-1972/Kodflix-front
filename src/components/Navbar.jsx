import React from 'react';

import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__logo">KODFLIX</div>
      <nav className="navbar__nav">
        <span className="navbar__link navbar__link--active">Home</span>
        <span className="navbar__link">TV Shows</span>
        <span className="navbar__link">Movies</span>
        <span className="navbar__link">My List</span>
      </nav>
      <div className="navbar__actions">
        <span className="navbar__icon">🔍</span>
        <span className="navbar__icon">👤</span>
      </div>
    </header>
  );
}

export default Navbar;

