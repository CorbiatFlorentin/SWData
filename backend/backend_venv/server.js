// server.js
const express = require('express');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const authRoutes      = require('./routes/authRoutes');
const userRoutes      = require('./routes/userRoutes');
const adminRoutes     = require('./routes/adminRoutes');
const patchnotesRoutes= require('./routes/patchnotesRoutes');
const monsterRoutes   = require('./routes/monsterRoutes');
const teamsRoutes     = require('./routes/teamsRoutes');
const db              = require('./config/db-config');

const app = express();

// Limiteur de connexion sur /auth/login
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Trop de tentatives de connexion. Réessaie dans une minute.'
    });
  }
});

app.locals.db = db;
app.use(cors());
app.use(bodyParser.json());

// Static files
app.use(
  '/static/monsters',
  express.static(path.join(__dirname, 'database', 'monsters_icons'))
);

// Appliquer le rate limiter uniquement sur /auth/login
app.use('/auth/login', loginLimiter);

// Montage des routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/api', patchnotesRoutes);
app.use('/api/monsters', monsterRoutes);
app.use('/teams', teamsRoutes);

// Middleware de gestion globale des erreurs (en dernier)
app.use((err, _req, res, _next) => {
  console.error('ERREUR API:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
