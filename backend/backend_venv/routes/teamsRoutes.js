console.log('▶️  Lancement de server.js');

const express       = require('express');
const rateLimit     = require('express-rate-limit');
require('dotenv').config();
const bodyParser    = require('body-parser');
const cors          = require('cors');
const path          = require('path');
const helmet        = require('helmet');

const authRoutes       = require('./routes/authRoutes');
const userRoutes       = require('./routes/userRoutes');
const adminRoutes      = require('./routes/adminRoutes');
const patchnotesRoutes = require('./routes/patchnotesRoutes');
const monsterRoutes    = require('./routes/monsterRoutes');
const db               = require('./config/db-config');

const app = express();

// 📁 CORS global 
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};
app.use(cors(corsOptions));

// 🔐 Sécurité
app.use(helmet());

// 🔧 Parsers
app.use(bodyParser.json());


const staticMonstersPath = path.join(__dirname, 'database', 'monsters_icons');
app.use('/static/monsters', express.static(staticMonstersPath));

// 📦 Rate limit login
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  handler: (_req, res) => {
    res.status(429).json({ error: 'Too many try to log, try later' });
  }
});

// 🧠 DB
app.locals.db = db;

// 🪵 Log chaque requête
app.use((req, _res, next) => {
  console.log(`--> ${req.method} ${req.originalUrl}`);
  next();
});

// 🧭 Routes
app.use('/auth/login', loginLimiter);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/api', patchnotesRoutes);
app.use('/api/monsters', monsterRoutes);

// ⚙️ Admin
console.log('🔌 Mounting adminRoutes on /admin');
app.use('/admin', adminRoutes);

// 🔧 POST /api/teams - insert/update team + slots
console.log('🔌 Mounting teams endpoints on /api/teams');
const teamsRouter = express.Router();

// 👉 Helper 
function upsertSlots(db, team_id, monsters, res, next) {
  db.run(`DELETE FROM team_slots WHERE team_id = ?`, [team_id], err => {
    if (err) return next(err);

    const stmt = db.prepare(`INSERT INTO team_slots (team_id, slot_idx, monster_id) VALUES (?, ?, ?)`);

    monsters.forEach((rawId, slot_idx) => {
      const monster_id = rawId > 0 ? rawId : null;
      stmt.run(team_id, slot_idx, monster_id);
    });

    stmt.finalize(err => {
      if (err) return next(err);
      res.json({ success: true });
    });
  });
}

// 👉 POST
teamsRouter.post('/', (req, res, next) => {
  const { tower_id, team_idx, monsters } = req.body;
  const db = req.app.locals.db;

  // 🧪 Validation 
  if (
    typeof tower_id !== 'number' || tower_id <= 0 ||
    typeof team_idx !== 'number' || team_idx < 0 ||
    !Array.isArray(monsters) ||
    monsters.length !== 3 ||
    monsters.some(m => typeof m !== 'number' || m <= 0)
  ) {
    return res.status(400).json({
      error: "Invalid input: tower_id, team_idx, and 3 valid monster IDs required"
    });
  }


  db.get(`SELECT team_id FROM teams WHERE tower_id = ? AND team_idx = ?`, [tower_id, team_idx], (err, row) => {
    if (err) return next(err);

    if (row) {
      return upsertSlots(db, row.team_id, monsters, res, next);
    }

    db.run(`INSERT INTO teams (tower_id, team_idx) VALUES (?, ?)`, [tower_id, team_idx], function (err) {
      if (err) return next(err);
      upsertSlots(db, this.lastID, monsters, res, next);
    });
  });
});

app.use('/api/teams', teamsRouter);

// 👀 GET /occupation
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

// ⚠️ Global error handler
app.use((err, _req, res, _next) => {
  console.error('ERROR API:', err);
  res.status(500).json({ error: err.message });
});

// 🚀 Server start
const PORT = process.env.PORT || 5000;
console.log('⌛ Avant app.listen()');
app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
console.log('👋 Fin du fichier server.js (mais le serveur tourne toujours)');
