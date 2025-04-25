// utils/teams.js
const sqlite3 = require("sqlite3").verbose();
const db      = new sqlite3.Database("mydatabase.db");

/* helper : filename (png) → monster_id */
function filenameToId(filename) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id FROM monsters WHERE image_filename = ?",
      [filename],
      (err, row) => (err ? reject(err) : resolve(row ? row.id : null))
    );
  });
}

/**
 * Upsert d'une team puis remplacement des 3 slots
 * @param {object} opts { db, userId, tower_id, team_idx, monsters[array] }
 */
exports.upsertTeam = async function upsertTeam(opts) {
  const { userId, tower_id, team_idx, monsters } = opts;

  /* 1) upsert ligne teams */
  const teamId = await new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO teams (tower_id, user_id, team_idx)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, tower_id, team_idx)
       DO UPDATE SET tower_id = excluded.tower_id`,
      [tower_id, userId, team_idx],
      function (err) {
        if (err) return reject(err);
        // lastID n'est rempli que si insertion ; sinon on relit l'id
        if (this.lastID) return resolve(this.lastID);
        db.get(
          `SELECT team_id FROM teams
           WHERE user_id=? AND tower_id=? AND team_idx=?`,
          [userId, tower_id, team_idx],
          (e2, row) => (e2 ? reject(e2) : resolve(row.team_id))
        );
      }
    );
  });

  /* 2) purge + insert des 3 slots */
  await new Promise((res, rej) =>
    db.run("DELETE FROM team_slots WHERE team_id=?", [teamId], (e) =>
      e ? rej(e) : res()
    )
  );

  const stmt = db.prepare(
    "INSERT INTO team_slots (team_id, slot_idx, monster_id) VALUES (?,?,?)"
  );

  for (let idx = 0; idx < monsters.length; idx++) {
    const fname = monsters[idx];
    if (!fname) continue;
    const id = await filenameToId(fname.split('/').pop()); // récupère seulement le png
    if (id) stmt.run(teamId, idx, id);
  }
  stmt.finalize();
};
