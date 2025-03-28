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

  // Gérer l'affichage du menu
  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId); // Annule le timeout si l'utilisateur revient
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    // Délai de 3 secondes avant de cacher le menu
    const id = setTimeout(() => {
      setShowMenu(false);
    }, 3000);
    setTimeoutId(id);
  };

  // Nettoyer le timeout si le composant est démonté
  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, [timeoutId]);

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/occupation">Occupation</Link>
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
              <Link to="/login" className="login-button">Se connecter</Link>
              
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
