import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import "../assets/style/OccupationPage.css";

import blueTower from "../assets/Img/tower_icon.png";
import MonsterSelect from "../components/MonsterSelect";

// ─────────────────────────────────────────────────────────────
// Coordonnées des tours bleues (en %)
const blueTowers = [
  { id: 1, name: "Tour 1", left: "16.5%", top: "65.5%" },
  { id: 2, name: "Tour 2", left: "28.5%", top: "81.5%" },
  { id: 3, name: "Tour 3", left: "20%",  top: "55%"   },
  { id: 4, name: "Tour 4", left: "30%",  top: "64%"   },
  { id: 5, name: "Tour 5", left: "36%",  top: "74%"   },
  { id: 6, name: "Tour 6", left: "22%",  top: "47%"   },
  { id: 7, name: "Tour 7", left: "28.5%",top: "47.5%" },
  { id: 8, name: "Tour 8", left: "36.5%",top: "50%"   },
  { id: 9, name: "Tour 9", left: "44.5%",top: "53%"   },
  { id: 10, name:"Tour 10", left: "43.5%",top: "64%"  },
  { id: 11, name:"Tour 11", left: "45.5%",top: "71%"  },
  { id: 12, name:"Tour 12", left: "46.5%",top: "82%"  },
];
// ─────────────────────────────────────────────────────────────

const MAX_TEAMS = 5;

export default function OccupationPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  /* ───── Auth guard ───── */
  useEffect(() => {
    if (!user) navigate("/register");
  }, [user, navigate]);

  /* ───── state : équipes par tour ───── */
  const [towerTeams, setTowerTeams] = useState(() => {
    const init = {};
    blueTowers.forEach((t) => (init[t.id] = [Array(3).fill(null)]));
    return init;
  });

  const [selectedTower, setSelectedTower] = useState(null);
  const [teamIdx,       setTeamIdx]       = useState(0);
  const [selectInfo,    setSelectInfo]    = useState(null); // {teamIdx, slotIdx}
  const [showList,      setShowList]      = useState(false); // panneau latéral

  /* ───── Helper : au moins un monstre rempli ? ───── */
  const hasAnyMonster = (teams) => teams.some((team) => team.some(Boolean));

  /* ───── Ajout d'une équipe ───── */
  const addTeam = () => {
    if (!selectedTower) return;
    setTowerTeams((prev) => {
      const copy  = { ...prev };
      const teams = [...copy[selectedTower.id]];
      if (teams.length >= MAX_TEAMS) return prev;
      teams.push(Array(3).fill(null));
      copy[selectedTower.id] = teams;
      return copy;
    });
    setTeamIdx((idx) => idx + 1);
  };

  /* ───── tours avec compo enregistrée ───── */
  const filledTowers = blueTowers.filter((t) => hasAnyMonster(towerTeams[t.id]));

  /* ───── Rendu ───── */
  return (
    <div className="occupation-container">
      {/* bouton flottant */}
      <button className="team-list-toggle" onClick={() => setShowList((p) => !p)}>
        Mes teams ({filledTowers.length})
      </button>

      {/* panneau latéral */}
      {showList && (
        <div className="team-list-panel">
          <h3>Compositions enregistrées</h3>
          {filledTowers.length === 0 ? (
            <p>Aucune pour l'instant</p>
          ) : (
            <ul>
              {filledTowers.map((t) => (
                <li
                  key={t.id}
                  onClick={() => {
                    setSelectedTower(t);
                    setTeamIdx(0);
                    setShowList(false);
                  }}
                >
                  {t.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* tours cliquables sur la carte */}
      {blueTowers.map((tower) => (
        <div
          key={tower.id}
          className="tower blue"
          style={{ left: tower.left, top: tower.top }}
          onClick={() => {
            setSelectedTower(tower);
            setTeamIdx(0);
            setShowList(false);
          }}
        >
          <img src={blueTower} alt={tower.name} />
        </div>
      ))}

      {/* modal tour */}
      {selectedTower && (
        <div className="overlay" onClick={() => setSelectedTower(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedTower(null)} aria-label="Fermer">&times;</button>
            <h2>{selectedTower.name}</h2>

            {/* onglets équipes */}
            <div className="team-selector">
              {towerTeams[selectedTower.id].map((_, idx) => (
                <button key={idx} className={`team-tab ${idx === teamIdx ? "active" : ""}`} onClick={() => setTeamIdx(idx)}>
                  Équipe {idx + 1}
                </button>
              ))}
              {towerTeams[selectedTower.id].length < MAX_TEAMS && (
                <button className="add-team" onClick={addTeam}>+ Équipe</button>
              )}
            </div>

            {/* cartes monstres */}
            <div className="cards">
              {towerTeams[selectedTower.id][teamIdx].map((monster, slotIdx) => (
                <button key={slotIdx} className="card" onClick={() => setSelectInfo({ teamIdx, slotIdx })}>
                  {monster ? (
                    <img src={monster.startsWith("blob:") ? monster : `http://localhost:5000${monster}`} alt="monstre" />
                  ) : (
                    "+ Monstre"
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MonsterSelect */}
      {selectInfo && (
        <MonsterSelect
          onPick={(filename) => {
            setTowerTeams((prev) => {
              const copy     = { ...prev };
              const teams    = [...copy[selectedTower.id]];
              const monsters = [...teams[selectInfo.teamIdx]];
              monsters[selectInfo.slotIdx] = filename;
              teams[selectInfo.teamIdx]    = monsters;
              copy[selectedTower.id]       = teams;
              return copy;
            });
          }}
          onClose={() => setSelectInfo(null)}
        />
      )}
    </div>
  );
}
