import React from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext'; 
import './App.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // Récupérer l'utilisateur connecté

  const redirectToHome = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <button className="navbar-brand" onClick={redirectToHome}>
        <strong>Sw Data</strong>
      </button>

      {/* Barre de recherche */}
      <form className="d-flex">
        <input
          className="form-control"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>

      {/* Icône de connexion */}
      <Link to="./Register" className="btn btn-link">
        <FaUser size={24} />
        {user && <span className="navbar-user">{user.pseudo}</span>} {/* Afficher le pseudo */}
      </Link>
    </nav>
  );
};

export default Navbar;




