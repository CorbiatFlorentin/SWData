const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Pour générer un jeton JWT
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const db = new sqlite3.Database('./mydatabase.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Clé secrète pour JWT (à garder confidentielle dans des variables d'environnement en production)
const JWT_SECRET = 'votre_cle_secrete';

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
        if (!nom || !prenom || !pseudo || !email || !mot_de_passe) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        db.run(
            `INSERT INTO users (nom, prenom, pseudo, email, mot_de_passe) VALUES (?, ?, ?, ?, ?)`,
            [nom, prenom, pseudo, email, hashedPassword],
            function (err) {
                if (err) {
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

// Route pour la connexion
app.post('/login', (req, res) => {
    const { email, mot_de_passe } = req.body;
    console.log('Login request body:', req.body);

    try {
        if (!email || !mot_de_passe) {
            console.log('Champs manquants');
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Recherche de l'utilisateur par email
        db.get(
            `SELECT * FROM users WHERE email = ?`,
            [email],
            async (err, user) => {
                if (err) {
                    return res.status(500).json({ error: 'Erreur serveur' });
                }
                if (!user) {
                    return res.status(404).json({ error: "L'utilisateur n'existe pas" });
                }

                // Comparaison des mots de passe
                const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
                if (!isPasswordValid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect' });
                }

                // Génération d'un jeton JWT
                const token = jwt.sign(
                    { id: user.id, pseudo: user.pseudo, email: user.email },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );

                res.status(200).json({
                    message: 'Connexion réussie',
                    pseudo: user.pseudo,
                    token
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route pour réinitialiser le mot de passe
app.post('/reset-password', (req, res) => {
    const { email } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        db.run(`UPDATE users SET mot_de_passe = ? WHERE email = ?`, [hashedPassword, email], (err) => {
            if (err) return res.status(500).json({ error: 'Erreur serveur' });

            res.json({ message: `Votre nouveau mot de passe temporaire est: ${tempPassword}` });
        });
    });
});

// Middleware pour vérifier le token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401); // Non autorisé

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Interdit
        req.user = user;
        next();
    });
}

// Suppression de compte avec authentification
app.delete('/delete-account', authenticateToken, (req, res) => {
    const email = req.user.email; // Email extrait du token JWT

    db.run(`DELETE FROM users WHERE email = ?`, [email], (err) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        res.json({ message: 'Compte supprimé avec succès' });
        console.log('Compte supprimé:',req.body)
    });
});


// Nouvelle route pour récupérer les patchnotes
app.get('/api/patchnotes', async (req, res) => {
    try {
        const url = 'https://sw.com2us.com/fr/skyarena/news/list?category=update';

        // Lance un navigateur headless
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Ouvre la page cible
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Extrait les articles avec 'news_tit'
        const patchNotes = await page.evaluate(() => {
            const notes = [];
            document.querySelectorAll('strong.news_tit').forEach((element) => {
                const title = element.textContent.trim();
                const link = element.closest('a')?.href;

                if (title && link) {
                    notes.push({
                        title,
                        link,
                    });
                }
            });
            return notes;
        });

        await browser.close();

        res.json(patchNotes); // Retourne les résultats
    } catch (error) {
        console.error('Erreur avec Puppeteer :', error.message);
        res.status(500).json({ error: 'Erreur lors du scraping des patch notes' });
    }
});

// Démarrage du serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
