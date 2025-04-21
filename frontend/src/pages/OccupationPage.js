import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import "../assets/style/OccupationPage.css";

import blueTower from "../assets/Img/tower_icon.png";
import MonsterSelect from "../components/MonsterSelect";

// ─────────────────────────────────────────────────────────────
// 1) Coordonnées des tours bleues (en %)
const blueTowers = [
  { id: 1, name: "Tour 1", left: "16.5%", top: "65.5%" },
  { id: 2, name: "Tour 2", left: "28.5%", top: "81.5%" },
  { id: 3, name: "Tour 3", left: "20%", top: "55%" },
  { id: 4, name: "Tour 4", left: "30%", top: "64%" },
  { id: 5, name: "Tour 5", left: "36%", top: "74%" },
  { id: 6, name: "Tour 6", left: "22%", top: "47%" },
  { id: 7, name: "Tour 7", left: "28.5%", top: "47.5%" },
  { id: 8, name: "Tour 8", left: "36.5%", top: "50%" },
  { id: 9, name: "Tour 9", left: "44.5%", top: "53%" },
  { id: 10, name: "Tour 10", left: "43.5%", top: "64%" },
  { id: 11, name: "Tour 11", left: "45.5%", top: "71%" },
  { id: 12, name: "Tour 12", left: "46.5%", top: "82%" },
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

  /* ───── State global : composition par tour ───── */
  const [towerTeams, setTowerTeams] = useState(() => {
    const base = {};
    blueTowers.forEach((t) => {
      base[t.id] = [Array(3).fill(null)]; // 1 équipe vide par défaut
    });
    return base;
  });

  const [selectedTower, setSelectedTower] = useState(null); // objet tour
  const [teamIdx, setTeamIdx] = useState(0); // index équipe courante
  const [selectInfo, setSelectInfo] = useState(null); // {teamIdx, slotIdx}

  /* ───── Ajout d'une équipe ───── */
  const addTeam = () => {
    if (!selectedTower) return;
    setTowerTeams((prev) => {
      const copy = { ...prev };
      const teams = [...copy[selectedTower.id]];
      if (teams.length >= MAX_TEAMS) return prev;
      teams.push(Array(3).fill(null));
      copy[selectedTower.id] = teams;
      return copy;
    });
    setTeamIdx((prev) => prev + 1);
  };

  /* ───── Rendu ───── */
  return (
    <div className="occupation-container">
      {/* Carte : tours */}
      {blueTowers.map((tower) => (
        <div
          key={tower.id}
          className="tower blue"
          style={{ left: tower.left, top: tower.top }}
          onClick={() => {
            setSelectedTower(tower);
            setTeamIdx(0);
          }}
        >
          <img src={blueTower} alt={tower.name} />
        </div>
      ))}

      {/* Overlay + modal */}
      {selectedTower && (
        <div className="overlay" onClick={() => setSelectedTower(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedTower(null)}
              aria-label="Fermer"
            >
              &times;
            </button>

            <h2>{selectedTower.name}</h2>

            {/* Sélecteur d'équipes */}
            <div className="team-selector">
              {towerTeams[selectedTower.id].map((_, idx) => (
                <button
                  key={idx}
                  className={`team-tab ${idx === teamIdx ? "active" : ""}`}
                  onClick={() => setTeamIdx(idx)}
                >
                  Équipe {idx + 1}
                </button>
              ))}

              {towerTeams[selectedTower.id].length < MAX_TEAMS && (
                <button className="add-team" onClick={addTeam}>
                  + Équipe
                </button>
              )}
            </div>

            {/* Cartes monstres pour l'équipe sélectionnée */}
            <div className="cards">
              {towerTeams[selectedTower.id][teamIdx].map((monster, slotIdx) => (
                <button
                  key={slotIdx}
                  className="card"
                  onClick={() => setSelectInfo({ teamIdx, slotIdx })}
                >
                  {monster ? (
                    <img
                      src={
                        monster.startsWith("http") || monster.startsWith("blob:")
                          ? monster
                          : `http://localhost:5000/static/monsters/${monster}`
                      }
                      alt=""
                    />
                  ) : (
                    "+ Monstre"
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sélecteur de monstres */}
      {selectInfo && (
        <MonsterSelect
          onPick={(m) => {
            setTowerTeams((prev) => {
              const copy = { ...prev };
              const teams = [...copy[selectedTower.id]];
              const monsters = [...teams[selectInfo.teamIdx]];
              monsters[selectInfo.slotIdx] = m.image_filename; // on stocke le filename
              teams[selectInfo.teamIdx] = monsters;
              copy[selectedTower.id] = teams;
              return copy;
            });
          }}
          onClose={() => setSelectInfo(null)}
        />
      )}
    </div>
  );
}
