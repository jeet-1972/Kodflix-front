import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css';

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

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
        <button type="button" className="navbar__button" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Navbar;

