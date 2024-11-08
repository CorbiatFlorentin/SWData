import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Register from './Register'; // Vérifie que cet import est correct

function AppRoutes() {
  return (
    <Routes>
      <Route path="/Register" element={<Register />} /> {/* Route pour Register */}
      <Route path="/" element={<App />} /> {/* Route pour la page d'accueil */}
    </Routes>
  );
}

export default AppRoutes;