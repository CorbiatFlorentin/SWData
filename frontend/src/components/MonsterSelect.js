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
      .then(data => {
        console.log("[MonsterSelect] Data reçue :", data);
        setList(data);
      })
      .catch(err => console.error("[MonsterSelect] fetch error:", err));
  }, []);

  if (!visible) return null;

  const filtered = list
    .filter(m => !excludeIds.includes(m.id))
    .filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );

  const getImgUrl = (imgPath) => {
    // Extrait uniquement le nom de fichier si un chemin complet est fourni
    const fileName = imgPath.split('/').pop();
    return `http://localhost:5000/static/monsters/${fileName}`;
  };

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
            {filtered.map(m => {
              const imgUrl = getImgUrl(m.img);
              console.log(`[MonsterSelect] ${m.name} →`, imgUrl);

              return (
                <button
                  key={m.id}
                  className="ms-card"
                  onClick={() => {
                    onPick(m);
                    onClose();
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={m.name}
                    onError={(e) => {
                      e.target.src = "/assets/icons/fallback.png"; // facultatif
                      e.target.alt = "Image manquante";
                    }}
                  />
                  <span>{m.name}</span>
                </button>
              );
            })}
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
