import React, { useEffect, useState } from "react";
import "../assets/style/MonsterSelect.css";

export default function MonsterSelect({ onPick, onClose }) {
  const [list,   setList]   = useState([]);
  const [search, setSearch] = useState("");

  /* Charge la liste une seule fois */
  useEffect(() => {
    fetch("http://localhost:5000/api/monsters")
      .then((r) => r.json())
      .then(setList)
      .catch(console.error);
  }, []);

  /* Filtrage côté client */
  const filtered = list.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ms-backdrop" onClick={onClose}>
      <div className="ms-panel right" onClick={(e) => e.stopPropagation()}>
        {/* barre de recherche */}
        <input
          placeholder="Recherche…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* grille des monstres */}
        <div className="ms-grid">
          {filtered.map((m) => (
            <button
              key={m.id}
              className="ms-card"
              onClick={() => {
                onPick(m.img);   
                onClose();       
              }}
            >
              <img src={`http://localhost:5000${m.img}`} alt={m.name} />
              <span>{m.name}</span>
            </button>
          ))}
        </div>

        <button className="ms-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}
