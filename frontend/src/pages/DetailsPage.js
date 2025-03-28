import React from 'react';
import { useParams } from 'react-router-dom';
import '../assets/style/DetailsPage.css';

const DetailsPage = () => {
  const { groupIndex } = useParams(); // Récupère l'index du groupe

  return (
    <div className="details-container">
      <h1>Détails pour le groupe {parseInt(groupIndex) + 1}</h1>
      <div className="strategy-section">
        <h2>Stratégie :</h2>
        <div className="strategy-box"></div>
      </div>
    </div>
  );
};

export default DetailsPage;