import React from 'react';
import { FaUser } from 'react-icons/fa'; // Pour l'icône de l'utilisateur
import { useNavigate } from 'react-router-dom'; // Importer useNavigate pour la redirection
import './App.css'; // Assurez-vous que le fichier CSS est importé

const Navbar = () => {
  const navigate = useNavigate(); 
  
  const redirectToHome = () => {
    navigate('/');  // Rediriger vers la page d'accueil
  };

  return (
    <nav className="navbar">
      <button className="navbar-brand" onClick={redirectToHome}>
        <strong>Sw Data</strong>
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


