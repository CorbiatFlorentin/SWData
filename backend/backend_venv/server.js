const express = require('express');
const rateLimit  = require('express-rate-limit');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const patchnotesRoutes = require('./routes/patchnotesRoutes');
const monsterRoutes    = require('./routes/monsterRoutes');
const teamsRoutes = require('./routes/teamsRoutes');
const db = require("./config/db-config");
const app = express();


const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Trop de tentatives de connexion. Réessaie dans une minute.'
    });
  }
});
// Middleware
app.locals.db = db;
app.use(cors());
app.use(bodyParser.json());

app.use(
      '/static/monsters',
      express.static(path.join(__dirname, 'database', 'monsters_icons'))
    );

app.use((err, req, res, _next) =>{
  console.error("ERREUR API:", err)
  res.status(500).json({error: err.message});
});

app.use('/auth/login', loginLimiter);


// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/api', patchnotesRoutes);
app.use('/api/monsters', monsterRoutes);
app.use('/teams', teamsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));



