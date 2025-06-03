import React, { useEffect, useState } from "react";
import "../assets/style/MonsterSelect.css";

export default function MonsterSelect({
  visible,
  onPick,
  onClose,
  excludeIds = []
}) {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/monsters")
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => setList(data))
      .catch(err => console.error("[MonsterSelect] fetch error:", err));
  }, []);

  if (!visible) return null;

  // on filtre à la fois sur le texte et sur les ids exclus
  const filtered = list
    .filter(m => !excludeIds.includes(m.id))
    .filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="ms-backdrop" onClick={onClose}>
      <div className="ms-panel right" onClick={e => e.stopPropagation()}>
        <input
          placeholder="Recherche…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {list.length === 0 ? (
          <div className="ms-loading">Chargement…</div>
        ) : (
          <div className="ms-grid">
            {filtered.map(m => (
              <button
                key={m.id}
                className="ms-card"
                onClick={() => {
                  onPick(m.img);
                  onClose();
                }}
              >
                <img
                  src={`http://localhost:5000${m.img}`}
                  alt={m.name}
                />
                <span>{m.name}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="ms-empty">Aucun monstre disponible</div>
            )}
          </div>
        )}

        <button className="ms-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}
