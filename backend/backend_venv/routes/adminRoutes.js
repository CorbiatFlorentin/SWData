const express = require('express');
const db      = require('../config/db-config');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();


router.get(
  '/',
  authenticateToken,
  (req, res) => {
    console.log("▶️ [adminRoutes] GET /admin — headers:", req.headers);
    res.json({ message: 'Admin base route OK' });
  }
);


router.get(
  '/users',
  authenticateToken,
  (req, res) => {
    console.log("▶️ [adminRoutes] GET /admin/users — headers:", req.headers);
    const query = `
      SELECT user_id, nom, prenom, pseudo, email, role, created_at, last_activity
      FROM users
    `;
    db.all(query, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Error while getting users' });
      }
      res.json(rows);
    });
  }
);


router.delete(
  '/users/:id',
  authenticateToken,
  (req, res) => {
    console.log("▶️ [adminRoutes] DELETE /admin/users/:id — headers:", req.headers);
    const userId = req.params.id;
    db.run('DELETE FROM users WHERE user_id = ?', [userId], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error while deleting user.' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.json({ message: `User ID ${userId} deleted.` });
    });
  }
);


router.put(
  '/users/:id/role',
  authenticateToken,
  (req, res) => {
    console.log("▶️ [adminRoutes] PUT /admin/users/:id/role — headers:", req.headers);
    const userId = req.params.id;
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Use "admin" or "user".' });
    }

    db.run(
      'UPDATE users SET role = ? WHERE user_id = ?',
      [role, userId],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Error while updating role.' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'User not found.' });
        }
        res.json({ message: `User ${userId} role updated to '${role}'.` });
      }
    );
  }
);

router.delete(
  '/users/inactive',
  authenticateToken,
  (req, res) => {
    console.log("▶️ [adminRoutes] DELETE /admin/users/inactive — headers:", req.headers);
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    const formattedDate = threeYearsAgo.toISOString(); // format compatible SQLite

    const query = `DELETE FROM users WHERE last_activity < ?`;

    db.run(query, [formattedDate], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error while deleting inactive users.' });
      }
      res.json({ message: `✅ ${this.changes} utilisateur(s) inactif(s) supprimé(s).` });
    });
  }
);


module.exports = router;
