// routes/authRoutes.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const db      = require('../config/db-config');
const { generateToken } = require('../config/jwt-config');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { nom, prenom, pseudo, email, mot_de_passe, role = 'user' } = req.body;
  if (!nom || !prenom || !pseudo || !email || !mot_de_passe) {
    return res.status(400).json({ error: 'All fields require' });
  }

  try {
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO users
        (nom, prenom, pseudo, email, mot_de_passe, role, created_at, last_activity, login_attempts, locked_until)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NULL)`,
      [nom, prenom, pseudo, email, hashedPassword, role, now, now],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: "mail already used" });
          }
          return res.status(500).json({ error: err.message });
        }
        // this.lastID correspond à user_id
        const token = generateToken({
          id: this.lastID,
          pseudo,
          email,
          role
        });
        res.status(201).json({
          message: 'User created with success',
          token
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Servor error with password' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: 'All fields require' });
  }

  db.get(
    `SELECT * FROM users WHERE email = ?`,
    [email],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Servor error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const now = new Date();
      if (user.locked_until && new Date(user.locked_until) > now) {
        return res
          .status(423)
          .json({ error: 'Accoutn temporary lock, try later' });
      }

      const isValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
      if (!isValid) {
        let attempts = (user.login_attempts || 0) + 1;
        let lockUntil = null;

        if (attempts >= 5) {
          lockUntil = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
          attempts = 0;
        }

        db.run(
          `UPDATE users SET login_attempts = ?, locked_until = ? WHERE user_id = ?`,
          [attempts, lockUntil, user.user_id]
        );
        return res.status(401).json({ error: 'password incorect' });
      }

      db.run(
        `UPDATE users SET login_attempts = 0, locked_until = NULL, last_activity = ? WHERE user_id = ?`,
        [now.toISOString(), user.user_id]
      );

      const token = generateToken({
        id: user.user_id,
        pseudo: user.pseudo,
        email: user.email,
        role: user.role
      });
      res.status(200).json({ message: 'Connection success', token });
    }
  );
});

router.post('/reset-password', (req, res) => {
  const { email } = req.body;
  res.json({ message: 'email password change send' });
});

module.exports = router;
