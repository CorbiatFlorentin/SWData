console.log('▶️  Lancement de server.js');

const express       = require('express');
const rateLimit     = require('express-rate-limit');
require('dotenv').config();
const bodyParser    = require('body-parser');
const cors          = require('cors');
const path          = require('path');

const authRoutes       = require('./routes/authRoutes');
const userRoutes       = require('./routes/userRoutes');
const adminRoutes      = require('./routes/adminRoutes');
const patchnotesRoutes = require('./routes/patchnotesRoutes');
const monsterRoutes    = require('./routes/monsterRoutes');
const db               = require('./config/db-config');

const app = express();

// Limiteur sur /auth/login
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  handler: (_req, res) => {
    res.status(429).json({ error: 'Too many try to log, try later' });
  }
});

app.locals.db = db;
app.use(cors());
app.use(bodyParser.json());

// Debug : log de chaque requête
app.use((req, _res, next) => {
  console.log(`--> ${req.method} ${req.originalUrl}`);
  next();
});

// Static files pour les icônes de monstres
app.use(
  '/static/monsters',
  express.static(path.join(__dirname, 'database', 'monsters_icons'))
);

// Rate limit login
app.use('/auth/login', loginLimiter);

// Routes publiques / non-API
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Montage des routes admin AVANT tout préfixe /api
console.log('🔌 Mounting adminRoutes on /admin');
app.use('/admin', adminRoutes);

// Routes API métier
app.use('/api', patchnotesRoutes);
app.use('/api/monsters', monsterRoutes);

// Routes équipes avec création automatique si nécessaire
console.log('🔌 Mounting teams endpoints on /api/teams');
const teamsRouter = express.Router();

// Helper pour supprimer et recréer 3 slots
function upsertSlots(db, team_id, monsters, res, next) {
  db.run(
    `DELETE FROM team_slots WHERE team_id = ?`,
    [team_id],
    err => {
      if (err) return next(err);
      const stmt = db.prepare(
        `INSERT INTO team_slots (team_id, slot_idx, monster_id) VALUES (?, ?, ?)`
      );
      monsters.forEach((rawId, slot_idx) => {
        const monster_id = rawId > 0 ? rawId : null;
        stmt.run(team_id, slot_idx, monster_id);
      });
      stmt.finalize(err => {
        if (err) return next(err);
        res.json({ success: true });
      });
    }
  );
}

// POST /api/teams - update or create team + slots
teamsRouter.post('/', (req, res, next) => {
  const { tower_id, team_idx, monsters } = req.body;
  const db = req.app.locals.db;

  // 1) Vérifier si la team existe
  db.get(
    `SELECT team_id FROM teams WHERE tower_id = ? AND team_idx = ?`,
    [tower_id, team_idx],
    (err, row) => {
      if (err) return next(err);

      if (row) {
        // team existante -> on upsert ses slots
        return upsertSlots(db, row.team_id, monsters, res, next);
      }

      // 2) Sinon, on la crée puis on upsert ses slots
      db.run(
        `INSERT INTO teams (tower_id, team_idx) VALUES (?, ?)`,
        [tower_id, team_idx],
        function(err) {
          if (err) return next(err);
          upsertSlots(db, this.lastID, monsters, res, next);
        }
      );
    }
  );
});

app.use('/api/teams', teamsRouter);

// Endpoint occupation (agreg)
app.get('/occupation', (req, res, next) => {
  const db = req.app.locals.db;
  db.all(
    `SELECT 
       t.tower_id,
       t.team_idx,
       GROUP_CONCAT(ts.monster_id, ',') AS monsters
     FROM teams AS t
     LEFT JOIN team_slots AS ts
       ON t.team_id = ts.team_id
     GROUP BY t.team_id
     ORDER BY t.tower_id, t.team_idx;`,
    [],
    (err, rows) => {
      if (err) return next(err);
      const result = rows.map(r => ({
        tower_id: r.tower_id,
        team_idx: r.team_idx,
        monsters: r.monsters || ''
      }));
      res.json(result);
    }
  );
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('ERROR API:', err);
  res.status(500).json({ error: err.message });
});

// Servor start
const PORT = process.env.PORT || 5000;
console.log('⌛ Avant app.listen()');
app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
console.log('👋 Fin du fichier server.js (mais le serveur tourne toujours)');