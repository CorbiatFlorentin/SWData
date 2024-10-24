import React from 'react';
import { FaUser } from 'react-icons/fa'; // Pour l'icône de l'utilisateur
import './App.css'; // Assurez-vous que le fichier CSS est importé

const Navbar = () => {
  
  // Fonction pour rafraîchir la page lorsque le bouton titre est cliqué
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <button className="navbar-brand" onClick={refreshPage}>
        <strong>My Website</strong>
      </button>

      {/* Barre de recherche */}
      <form className="d-flex">
        <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>

      {/* Symbole de connexion */}
      <button className="btn btn-link">
        <FaUser size={24} />
      </button>
    </nav>
  );
};

export default Navbar;

