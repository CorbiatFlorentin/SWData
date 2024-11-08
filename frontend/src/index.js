import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Importez BrowserRouter
import './App.css';
import AppRoutes from './AppRoutes'; 
import Navbar from './Navbar';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Navbar />
      <AppRoutes /> {/* Utilisez les routes définies */}
    </Router>
  </React.StrictMode>
);







