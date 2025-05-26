const router = require("express").Router();
const db     = require("../config/db-config");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const { upsertTeam } = require("../utils/teams");

router.get(
  "/",
  authenticateToken,
  authorizeRole,
  (req, res) => {
    const uid = req.user.id;
    const sql = `
      SELECT t.team_id, t.tower_id, t.team_idx,
             GROUP_CONCAT(ts.monster_id, ',') AS monsters
      FROM teams t
      LEFT JOIN team_slots ts ON ts.team_id = t.team_id
      WHERE t.user_id = ?
      GROUP BY t.team_id
    `;
    db.all(sql, [uid], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      // transform "1,2,0" → [1,2,0]
      const formatted = rows.map(r => ({
        team_id:  r.team_id,
        tower_id: r.tower_id,
        team_idx: r.team_idx,
        monsters: r.monsters
          ? r.monsters.split(",").map(n => Number(n))
          : [0,0,0]
      }));
      res.json(formatted);
    });
  }
);

router.post(
  "/",
  authenticateToken,
  authorizeRole,
  async (req, res) => {
    try {
      const { tower_id, team_idx, monsters } = req.body;
      if (!Array.isArray(monsters) || monsters.length !== 3) {
        return res.status(400).json({ error: "array monsters[3] expected" });
      }

      const userId = req.user.id;
      await upsertTeam(req.app.locals.db, {
        userId,
        tower_id,
        team_idx,
        monsters,
      });

      res.json({ message: "Team saved" });
    } catch (err) {
      console.error("✖ ERROR /teams :", err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
