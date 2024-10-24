// src/PatchNotesPage.js
import React from 'react';
import Navbar from './Navbar'; // Importe le composant Navbar si nécessaire

const PatchNotesPage = () => {
  return (
    <div>
      <Navbar />  {/* Si tu veux garder le même Navbar sur toutes les pages */}
      <div className="page-container">
        <h1>PatchNotes</h1>
        <p>
          Bienvenue sur la page PatchNotes ! Ici, vous pouvez trouver toutes les informations
          pertinentes concernant les stratégies, les personnages et les équipements
          recommandés pour progresser dans cette section du jeu.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula libero non est pretium,
          a tristique tortor sollicitudin. Aliquam erat volutpat. Nulla facilisi.
        </p>
      </div>
    </div>
  );
}

export default PatchNotesPage;
