// config/jwt-config.js
const jwt = require('jsonwebtoken');

// Ideally load from .env — fallback to default for development
const JWT_SECRET = process.env.JWT_SECRET || 'your-dev-secret-key';

function generateToken(user) {
  // user.id must be defined; use user.user_id if coming directly from DB
  return jwt.sign(
    {
      id: user.id,
      pseudo: user.pseudo,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
};
