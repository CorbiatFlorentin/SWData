const express = require('express');
const db = require('../config/db-config');
const { authenticateToken, authorizeRole } = require('../middleware/auth'); // authorizeRole n'est pas utilisé ici

const router = express.Router();

// 📥 Récupération de tous les utilisateurs (admin uniquement)
router.get('/users', authenticateToken, authorizeRole('admin'), (req, res) => {
    const query = `
        SELECT user_id, nom, prenom, pseudo, email, role, created_at, last_activity 
        FROM users
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
        }
        res.json(rows);
    });
});

// 🗑 Suppression d'un utilisateur par user_id
router.delete('/users/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé. Admin uniquement.' });
    }

    const userId = req.params.id;

    db.run('DELETE FROM users WHERE user_id = ?', [userId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        res.json({ message: `Utilisateur ID ${userId} supprimé.` });
    });
});

// 🔁 Mise à jour du rôle d'un utilisateur
router.put('/users/:id/role', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé. Admin uniquement.' });
    }

    const userId = req.params.id;
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
        return res.status(400).json({ error: 'Rôle invalide. Utilisez "admin" ou "user".' });
    }

    db.run('UPDATE users SET role = ? WHERE user_id = ?', [role, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        res.json({ message: `Rôle de l'utilisateur ${userId} mis à jour en '${role}'.` });
    });
});

module.exports = router;
