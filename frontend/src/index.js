import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Importez BrowserRouter
import './App.css';
import AppRoutes from './Routes'; // Importer AppRoutes qui contient toutes les routes

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <AppRoutes /> {/* Utilisez les routes définies */}
    </Router>
  </React.StrictMode>
);







