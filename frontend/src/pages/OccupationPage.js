import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import "../assets/style/OccupationPage.css";

import blueTower from "../assets/Img/tower_icon.png";
import MonsterSelect from "../components/MonsterSelect";

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

const MAX_TEAMS = 5;
const API_BASE = "http://localhost:5000";
const API = `${API_BASE}/api`;

export default function OccupationPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const token = localStorage.getItem("token");

  const [towerTeams, setTowerTeams] = useState(() => {
    const init = {};
    blueTowers.forEach((t) => (init[t.id] = [[null, null, null]]));
    return init;
  });
  const [monsterMap, setMonsterMap] = useState({});
  const [selectedTower, setSelectedTower] = useState(null);
  const [teamIdx, setTeamIdx] = useState(0);
  const [selectInfo, setSelectInfo] = useState(null);
  const [showList, setShowList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate("/register");
  }, [user, navigate]);

  useEffect(() => {
    fetch(`${API}/monsters`)
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        data.forEach((m) => {
          map[m.id] = m.img;
        });
        setMonsterMap(map);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/occupation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((rows) => {
        const data = {};
        blueTowers.forEach((t) => (data[t.id] = [[null, null, null]]));
        rows.forEach((r) => {
          const arr = r.monsters
            ? r.monsters.split(",").map((id) => {
                const num = parseInt(id);
                return num > 0 ? num : null;
              })
            : [null, null, null];
          data[r.tower_id][r.team_idx] = arr;
        });
        setTowerTeams(data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [token]);

  const saveTeam = (towerId, teamIdx, monsters) => {
    if (!token) return;
    const monsterIds = monsters.map((m) => (typeof m === "number" ? m : 0));
    const isCreation = monsterIds.every((id) => id === 0);
    const isPartiallyFilled = !isCreation && !monsterIds.every((id) => id > 0);
    if (isPartiallyFilled) return;

    fetch(`${API}/teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tower_id: towerId, team_idx: teamIdx, monsters: monsterIds }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Save error ${res.status}`);
        return res.json();
      })
      .then(() => console.log("Team saved"))
      .catch(console.error);
  };

  const hasAnyMonster = (teams) => teams.some((team) => team.some(Boolean));
  const filledTowers = blueTowers.filter((t) => hasAnyMonster(towerTeams[t.id] || []));

  const addTeam = () => {
    if (!selectedTower) return;
    const currentTeams = towerTeams[selectedTower.id] || [];
    const newTeamIdx = currentTeams.length;
    setTowerTeams((prev) => {
      const copy = { ...prev };
      const teams = [...copy[selectedTower.id]];
      if (teams.length >= MAX_TEAMS) return prev;
      teams.push([null, null, null]);
      copy[selectedTower.id] = teams;
      return copy;
    });
    setTeamIdx(newTeamIdx);
  };

  if (isLoading) return <div className="loading">Chargement…</div>;

  return (
    <div className="occupation-container">
      <button className="team-list-toggle" onClick={() => setShowList((p) => !p)}>
        Mes teams ({filledTowers.length})
      </button>
      {showList && (
        <div className="team-list-panel">
          {filledTowers.map((t) => (
            <button
              key={t.id}
              className="team-list-item"
              onClick={() => {
                setSelectedTower(t);
                setTeamIdx(0);
                setShowList(false);
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {blueTowers.map((t) => (
        <div
          key={t.id}
          className="tower blue"
          style={{ left: t.left, top: t.top }}
          onClick={() => {
            setSelectedTower(t);
            setTeamIdx(0);
            setShowList(false);
          }}
        >
          <img src={blueTower} alt={t.name} />
        </div>
      ))}

      {selectedTower && (
        <div className="overlay" onClick={() => setSelectedTower(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedTower(null)}>
              ×
            </button>
            <h2>{selectedTower.name}</h2>

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
                        monsterMap[monster]
                          ? `http://localhost:5000/static/monsters/${monsterMap[monster].split("/").pop()}`
                          : ""
                      }
                      alt="monstre"
                      onError={(e) => {
                        e.target.src = "/assets/icons/fallback.png";
                      }}
                    />
                  ) : (
                    "+ Monstre"
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <MonsterSelect
        visible={!!selectInfo}
        onPick={(monster) => {
          const { teamIdx: tI, slotIdx: sI } = selectInfo;
          const teamsCopy = [...towerTeams[selectedTower.id]];
          teamsCopy[tI][sI] = monster.id;
          setTowerTeams((prev) => ({ ...prev, [selectedTower.id]: teamsCopy }));
          saveTeam(selectedTower.id, tI, teamsCopy[tI]);
          setSelectInfo(null);
        }}
        onClose={() => setSelectInfo(null)}
      />
    </div>
  );
}
