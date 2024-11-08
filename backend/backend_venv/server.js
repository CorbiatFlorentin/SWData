const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors'); // Pour gérer les requêtes cross-origin

const app = express();
const db = new sqlite3.Database('./database.sqlite'); // Chemin vers la base de données SQLite

// Middleware
app.use(cors()); // Autorise les requêtes depuis d'autres origines (nécessaire pour le front-end)
app.use(bodyParser.json());

// Création de la table "users" si elle n'existe pas déjà
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT,
        prenom TEXT,
        pseudo TEXT,
        email TEXT UNIQUE,
        mot_de_passe TEXT
    )
`);

// Route pour l'inscription
app.post('/register', async (req, res) => {
    const { nom, prenom, pseudo, email, mot_de_passe } = req.body;

    try {
        // Vérifie si tous les champs requis sont remplis
        if (!nom || !prenom || !pseudo || !email || !mot_de_passe) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Chiffrement du mot de passe
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Insertion de l'utilisateur dans la base de données
        db.run(
            `INSERT INTO users (nom, prenom, pseudo, email, mot_de_passe) VALUES (?, ?, ?, ?, ?)`,
            [nom, prenom, pseudo, email, hashedPassword],
            function (err) {
                if (err) {
                    // Vérifie si l'erreur est due à un doublon (e.g., email unique)
                    if (err.message.includes("UNIQUE constraint failed")) {
                        return res.status(400).json({ error: "L'email est déjà utilisé" });
                    }
                    return res.status(400).json({ error: err.message });
                }
                res.status(201).json({ message: 'Utilisateur créé avec succès' });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Démarrage du serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
