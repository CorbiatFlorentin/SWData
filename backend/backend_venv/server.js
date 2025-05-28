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
const teamsRoutes      = require('./routes/teamsRoutes');
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

console.log('🔌 Mounting teamsRoutes on /api/teams');
app.use('/api/teams', teamsRoutes);

// Endpoint occupation (agrégation)
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

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
console.log('⌛ Avant app.listen()');
app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
console.log('👋 Fin du fichier server.js (mais le serveur tourne toujours)');
