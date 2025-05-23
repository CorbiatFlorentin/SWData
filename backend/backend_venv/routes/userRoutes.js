// routes/userRoutes.js
const express = require('express');
const db = require('../config/db-config');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('User route OK');
});

// Suppression de compte (protégée)
router.delete(
  '/delete-account',
  authenticateToken,
  (req, res) => {
    const userId = req.user.id; // c'est en fait user_id
    db.run(
      `DELETE FROM users WHERE user_id = ?`,
      [userId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Compte supprimé avec succès' });
      }
    );
  }
);

module.exports = router;
