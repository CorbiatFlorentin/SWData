import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/style/Arena.css';


const ArenaPage = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = () => {
      const sampleItems = [
        { id: 1, icon: '⚔️', name: 'Épée' },
        { id: 2, icon: '🛡️', name: 'Bouclier' },
        { id: 3, icon: '🧙‍♂️', name: 'Mage' },
        { id: 4, icon: '🏹', name: 'Archer' },
        { id: 5, icon: '🗡️', name: 'Dague' },
        { id: 6, icon: '🐉', name: 'Dragon' },
        { id: 7, icon: '🔥', name: 'Feu' },
        { id: 8, icon: '❄️', name: 'Glace' },
        { id: 9, icon: '⚡', name: 'Éclair' },
        { id: 10, icon: '💀', name: 'Mort' },
      ];
      setItems(sampleItems);
    };
    fetchData();
  }, []);

  //Click on a line
  const handleRowClick = (groupIndex) => {
    navigate(`/details/${groupIndex}`);
  };

  return (
    <div className="arena-container">
      <div className="page-container">
        <h1>Arena</h1>
        <p>Bienvenue sur la page Arena ! Ici, vous pouvez trouver toutes les informations
        pertinentes concernant les stratégies, les personnages et les équipements
        recommandés pour progresser dans cette section du jeu.</p>
      </div>
      <div className="list-container">
        {[0, 1, 2].map((groupIndex) => (
          <div
            key={groupIndex}
            className="rectangle-container"
            onClick={() => handleRowClick(groupIndex)} 
          >
            {items
              .slice(groupIndex * 4, groupIndex * 4 + 4)
              .map((item) => (
                <div key={item.id} className="item-container">
                  <span className="icon">{item.icon}</span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArenaPage;