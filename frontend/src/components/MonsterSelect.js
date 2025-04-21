import React, { useEffect, useState } from "react";
import "../assets/style/MonsterSelect.css";

export default function MonsterSelect({ onPick, onClose }) {
  const [list, setList]   = useState([]);   // ← on garde list/setList
  const [search, setSearch] = useState("");

  /** Chargement unique */
  useEffect(() => {
    fetch("http://localhost:5000/api/monsters")
      .then(r => r.json())
      .then(setList)           // ← pas d’erreur ESLint
      .catch(console.error);
  }, []);

  /** Filtrage */
  const filtered = list.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ms-backdrop" onClick={onClose}>
      <div className="ms-panel" onClick={e => e.stopPropagation()}>
        <input
          placeholder="Recherche…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="ms-grid">
          {filtered.map(m => (
            <button
              key={m.id}
              className="ms-card"
              onClick={() => { onPick(m); onClose(); }}
            >
              {/* on affiche l’URL déjà prête : m.img */}
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
