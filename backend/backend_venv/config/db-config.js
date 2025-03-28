const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la BDD SQLite
const db = new sqlite3.Database(path.join(__dirname, '../database/mydatabase.db'), (err) => {
    if (err) console.error('Erreur de connexion à la base de données :', err.message);
    else console.log('Connecté à la base de données SQLite.');
});

module.exports = db;
