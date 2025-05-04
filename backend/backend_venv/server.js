const express = require('express');
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

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/api', patchnotesRoutes);
app.use('/api/monsters', monsterRoutes);
app.use('/teams', teamsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));



