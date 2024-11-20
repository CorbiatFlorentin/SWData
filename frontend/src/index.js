import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Importez BrowserRouter
import './App.css';
import AppRoutes from './AppRoutes'; 
import Navbar from './Navbar';
import { UserProvider } from './UserContext';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <UserProvider>
    <Router>
      <Navbar />
      <AppRoutes /> {/* Utilisez les routes définies */}
    </Router>
    *</UserProvider>
  </React.StrictMode>
);







