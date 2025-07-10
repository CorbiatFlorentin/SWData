const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../database/mydatabase.db'), (err) => {
    if (err) console.error('Impossible to connect to the database :', err.message);
    else console.log('Connected at the SQlite3 database.');
});

module.exports = db;
