// utils/teams.js
/**
 * Upsert d'une "team" : si elle existe on met à jour ses slots, sinon on la crée.
 * @param {sqlite3.Database} db 
 * @param {{ userId: number, tower_id: number, team_idx: number, monsters: number[] }} params 
 */
function upsertTeam(db, { userId, tower_id, team_idx, monsters }) {
  return new Promise((resolve, reject) => {
    // 1. Cherche si la team existe déjà
    const findSql = `
      SELECT team_id
      FROM teams
      WHERE user_id = ? AND tower_id = ? AND team_idx = ?
    `;
    db.get(findSql, [userId, tower_id, team_idx], (err, row) => {
      if (err) return reject(err);

      const insertSlots = (teamId) => {
        // Supprime d'abord les anciens slots
        db.run(
          `DELETE FROM team_slots WHERE team_id = ?`,
          [teamId],
          (delErr) => {
            if (delErr) return reject(delErr);

            // Insert les nouveaux slots
            const stmt = db.prepare(`
              INSERT INTO team_slots (team_id, slot_idx, monster_id)
              VALUES (?, ?, ?)
            `);
            monsters.forEach((monsterId, slotIdx) => {
              stmt.run(teamId, slotIdx, monsterId);
            });
            stmt.finalize((finErr) => {
              if (finErr) return reject(finErr);
              resolve(teamId);
            });
          }
        );
      };

      if (row) {
        // 2a. Si existante, on met à jour ses slots
        return insertSlots(row.team_id);
      }

      // 2b. Sinon, on crée la team puis ses slots
      const createSql = `
        INSERT INTO teams (user_id, tower_id, team_idx)
        VALUES (?, ?, ?)
      `;
      db.run(createSql, [userId, tower_id, team_idx], function (insErr) {
        if (insErr) return reject(insErr);
        insertSlots(this.lastID);
      });
    });
  });
}

module.exports = { upsertTeam };
