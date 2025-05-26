const express = require('express');
const db = require('../config/db-config');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Admin get all users 
router.get('/users', authenticateToken, authorizeRole('admin'), (req, res) => {
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
});


router.delete('/users/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const userId = req.params.id;

    db.run('DELETE FROM users WHERE user_id = ?', [userId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error while suppressing.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found .' });
        }

        res.json({ message: `Usur ID ${userId} deletd.` });
    });
});

// 🔁 User's role update
router.put('/users/:id/role', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access refused. Admin only.' });
    }

    const userId = req.params.id;
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Use "admin" ou "user".' });
    }

    db.run('UPDATE users SET role = ? WHERE user_id = ?', [role, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error while update role.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ message: `User's role  ${userId} update in  '${role}'.` });
    });
});

module.exports = router;
