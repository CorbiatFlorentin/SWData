import React from 'react';
import { FaUser } from 'react-icons/fa'; // Pour l'icône de l'utilisateur


const Navbar = () => {
  
  // Fonction pour rafraîchir la page lorsque le bouton titre est cliqué
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        
        {/* Bouton-titre qui permet de rafraîchir la page */}
        <button className="navbar-brand btn btn-link" onClick={refreshPage}>
          <strong>My Website</strong>
        </button>
        
        {/* Search bar */}
        <form className="d-flex ms-auto">
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
        
        {/* Symbole de connexion */}
        <button className="btn btn-link ms-3">
          <FaUser size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
