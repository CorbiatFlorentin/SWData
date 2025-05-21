// routes/authRoutes.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const db      = require('../config/db-config');
const { generateToken } = require('../config/jwt-config');

const router = express.Router();

// ────────────────────────────────────────────────────────────────────────────────
// Inscription (register)
// ────────────────────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { nom, prenom, pseudo, email, mot_de_passe, role = 'user' } = req.body;
  if (!nom || !prenom || !pseudo || !email || !mot_de_passe) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO users (nom, prenom, pseudo, email, mot_de_passe, role, created_at, last_activity, login_attempts, locked_until)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NULL)`,
      [nom, prenom, pseudo, email, hashedPassword, role, now, now],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: "L'email est déjà utilisé" });
          }
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur lors du hash du mot de passe' });
  }
});

// ────────────────────────────────────────────────────────────────────────────────
// Connexion (login) avec lockout au bout de 5 échecs
// ────────────────────────────────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const now = new Date();

    if (user.locked_until && new Date(user.locked_until) > now) {
      return res
        .status(423)
        .json({ error: 'Compte temporairement verrouillé. Réessaie plus tard.' });
    }

    const isValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isValid) {
      let attempts = (user.login_attempts || 0) + 1;
      let lockUntil = null;

      
      if (attempts >= 5) {
        lockUntil = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
        attempts = 0; 
      }

      // Mettre à jour login_attempts et locked_until
      db.run(
        `UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?`,
        [attempts, lockUntil, user.id]
      );

      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // 3️⃣ Réinitialiser les compteurs après succès
    db.run(
      `UPDATE users SET login_attempts = 0, locked_until = NULL, last_activity = ? WHERE id = ?`,
      [now.toISOString(), user.id]
    );

    
    const token = generateToken(user);
    res.status(200).json({ message: 'Connexion réussie', token });
  });
});

module.exports = router;
