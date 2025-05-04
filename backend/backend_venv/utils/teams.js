/**
 * @typedef  {Object} TeamPayload
 * @property {number} tower_id   – id de la tour
 * @property {number} team_idx   – rang (0‑4) de l’équipe
 * @property {number[]} monsters – tableau EXACTEMENT de 3 ids (0 ou id)
 */

/**
 * Upsert d’une team + remplacement des 3 slots
 * @param {import('sqlite3').Database} db       Connexion SQLite passée par le routeur
 * @param {TeamPayload}                payload Données de l’équipe
 */
async function upsertTeam (db, { tower_id, team_idx, monsters }) {
  // ———————————————————————————
  // 1) FK activées sur cette connexion
  // ———————————————————————————
  await new Promise((res, rej) =>
    db.run("PRAGMA foreign_keys = ON", err => (err ? rej(err) : res()))
  );

  // ———————————————————————————
  // 2) INSERT … ON CONFLICT → team_id
  //    Conflit sur (tower_id, team_idx)
  // ———————————————————————————
  const teamId = await new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO teams (tower_id, team_idx)
       VALUES (?, ?)
       ON CONFLICT(tower_id, team_idx)
       DO UPDATE SET team_idx = excluded.team_idx`,
      [tower_id, team_idx],
      function (err) {
        if (err) return reject(err);

        // Si nouvel insert → this.lastID ; sinon on relit l’id existant
        if (this.lastID) return resolve(this.lastID);

        db.get(
          `SELECT team_id FROM teams WHERE tower_id = ? AND team_idx = ?`,
          [tower_id, team_idx],
          (e2, row) => (e2 ? reject(e2) : resolve(row.team_id))
        );
      }
    );
  });

  // ———————————————————————————
  // 3) Purge + insertion des 3 slots
  // ———————————————————————————
  await new Promise((res, rej) =>
    db.run("DELETE FROM team_slots WHERE team_id = ?", [teamId], e => (e ? rej(e) : res()))
  );

  const stmt = db.prepare(
    "INSERT INTO team_slots (team_id, slot_idx, monster_id) VALUES (?,?,?)"
  );

  monsters.forEach((mid, idx) => {
    if (mid) stmt.run(teamId, idx, mid);   // 0 → slot vide, on ignore
  });

  stmt.finalize();
}

module.exports = { upsertTeam };
