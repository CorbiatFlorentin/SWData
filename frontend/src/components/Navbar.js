import React, { useState } from 'react';
import { useEffect } from 'react';
import { useUser } from '../UserContext';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import '../assets/style/Navbar.css';


const Navbar = () => {
  const { user, logout } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId); 
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setShowMenu(false);
    }, 3000);
    setTimeoutId(id);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, [timeoutId]);

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/occupation">Occupation</Link>
        <Link to="patchnotes">Patchnotes</Link>
      </div>

      <div 
        className="nav-user" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        <i className="fas fa-user-circle user-icon"></i>

        {showMenu && (
          <div className="user-menu">
            {user ? (
              <>
                <p>👤 {user.pseudo}</p>
                <button onClick={logout} className="logout-button">Se déconnecter</button>
              </>
            ) : (
              <Link to="/register" className="register-button">Se connecter</Link>
              
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
