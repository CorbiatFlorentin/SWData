import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const OccupationPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate('/Register');
    }
  }, [user, navigate]);

  return (
    <div>
      <div className="page-container">
        <h1>Occupation</h1>
        <p>
          Bienvenue sur la page Occupation ! Ici, vous pouvez trouver toutes les informations
          pertinentes concernant les stratégies, les personnages et les équipements
          recommandés pour progresser dans cette section du jeu.
        </p>
      </div>
    </div>
  );
};

export default OccupationPage;
