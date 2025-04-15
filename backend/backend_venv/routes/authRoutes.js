const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db-config');
const { generateToken } = require('../config/jwt-config');

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
    const { nom, prenom, pseudo, email, mot_de_passe, role = 'user' } = req.body;
    if (!nom || !prenom || !pseudo || !email || !mot_de_passe) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const now = new Date().toISOString();

    db.run(`INSERT INTO users (nom, prenom, pseudo, email, mot_de_passe, role, created_at, last_activity) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nom, prenom, pseudo, email, hashedPassword, role, now, now], function (err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).json({ error: "L'email est déjà utilisé" });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Utilisateur créé avec succès' });
        });
});

// Connexion
router.post('/login', (req, res) => {
    const { email, mot_de_passe } = req.body;
    if (!email || !mot_de_passe) return res.status(400).json({ error: 'Tous les champs sont requis' });

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

        const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!isPasswordValid) return res.status(401).json({ error: 'Mot de passe incorrect' });

        const token = generateToken(user);

        // Mise à jour de la dernière activité
        const now = new Date().toISOString();
        db.run(`UPDATE users SET last_activity = ? WHERE user_id = ?`, [now, user.id]);

        res.status(200).json({ message: 'Connexion réussie', token });
    });
});

module.exports = router;
