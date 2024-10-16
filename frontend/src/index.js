import React from 'react';
import ReactDOM from 'react-dom/client';  // Utilisation de 'react-dom/client' dans React 18
import './App.css';
import App from './App';
import Navbar from './Navbar';



// Créer un root dans React 18 avec createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendre l'application dans le root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);




