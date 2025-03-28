require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'clé_secrète_par_défaut';

function generateToken(user) {
    return jwt.sign({ id: user.id, pseudo: user.pseudo, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '1h'
    });
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
