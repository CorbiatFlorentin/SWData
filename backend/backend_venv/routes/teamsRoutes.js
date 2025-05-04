const router = require("express").Router();
const db     = require("../config/db-config");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const { upsertTeam } = require("../utils/teams");

/* GET /teams  → toutes les teams de l'utilisateur connecté */
router.get("/", authenticateToken, authorizeRole, (req, res) => {
  console.log("[/teams] req.user = ", req.user);
  const uid = req.user_id;
  const sql = `
    SELECT t.team_id, t.tower_id, t.team_idx,
           GROUP_CONCAT(ts.monster_id, ',') AS monsters
    FROM teams t
    LEFT JOIN team_slots ts ON ts.team_id = t.team_id
    WHERE t.user_id = ?
    GROUP BY t.team_id
  `;
  db.all(sql, [uid], (err, rows) =>
    err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
});

/* POST /teams  → upsert d'une équipe */
router.post("/", authenticateToken, authorizeRole, async (req, res) => {
  try {
    const { tower_id, team_idx, monsters } = req.body;
    if (!Array.isArray(monsters) || monsters.length !== 3)
      return res.status(400).json({ error: "array monsters[3] attendu" });

    await upsertTeam(req.app.locals.db, {
      userId  : req.user_id,
      tower_id,
      team_idx,
      monsters,
    });

    res.json({ message: "team enregistrée" });
  } catch (err) {
    console.error("✖ ERREUR /teams :", err);   // <‑‑ log complet (stack)
    res.status(500).json({ error: "internal error" });
  }
});

module.exports = router;
