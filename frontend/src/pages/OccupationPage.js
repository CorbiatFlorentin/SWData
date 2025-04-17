import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import '../assets/style/OccupationPage.css';

// ─────────────────────────────────────────────────────────────
// 1) Tableau décrivant chaque tour bleue (coords en %)
import blueTower from '../assets/Img/tower_icon.png';   // ↰ adapte le chemin
const blueTowers = [
  { id: 1, name: 'Tour 1', left: '12%', top: '80%' },
  { id: 2, name: 'Tour 2', left: '25%', top: '66%' },
  { id: 3, name: 'Tour 3', left: '19%', top: '55%' },
  { id: 4, name: 'Tour 4', left: '31%', top: '50%' },
  // … ajoute le reste de tes tours
];
// ─────────────────────────────────────────────────────────────

const OccupationPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  /* ────────── Auth guard (inchangé) ────────── */
  useEffect(() => {
    if (!user) navigate('/register');
  }, [user, navigate]);

  /* ────────── État local ────────── */
  const [selectedTower, setSelectedTower] = useState(null);      // tour cliquée
  const [monsters, setMonsters]         = useState([null, null, null]); // 3 slots

  /* Chargement image monstre */
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Créé une URL locale pour pré‑afficher l’image
    const url = URL.createObjectURL(file);

    setMonsters(prev => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  /* ────────── Rendu ────────── */
  return (
    <div className="occupation-container">
      {/* 1) Carte : rend chaque tour bleue */}
      {blueTowers.map(tower => (
        <div
          key={tower.id}
          className="tower blue"
          style={{ left: tower.left, top: tower.top }}
          onClick={() => {
            setSelectedTower(tower);
            setMonsters([null, null, null]);       // réinitialise les slots
          }}
        >
          <img src={blueTower} alt={tower.name} />
        </div>
      ))}

      {/* 2) Overlay + conteneur */}
      {selectedTower && (
        <div
          className="overlay"
          onClick={() => setSelectedTower(null)} /* clic hors conteneur */
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}     /* bloque la propagation */
          >
            <button
              className="close-btn"
              onClick={() => setSelectedTower(null)}
              aria-label="Fermer"
            >
              &times;
            </button>

            <h2>{selectedTower.name}</h2>

            <div className="cards">
              {monsters.map((slot, idx) => (
                <label key={idx} className="card">
                  {slot ? (
                    <img src={slot} alt={`Monstre ${idx + 1}`} />
                  ) : (
                    '+ Monstre'
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={e => handleFileChange(idx, e)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OccupationPage;
