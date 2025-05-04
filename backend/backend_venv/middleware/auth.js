// middleware/auth.js
const { verifyToken } = require('../config/jwt-config');

/**
 * Vérifie la présence et la validité du JWT.
 * ▸ 401 → aucun token fourni
 * ▸ 403 → token invalide / expiré
 * Après succès : req.user = { user_id, role, … }
 */
function authenticateToken(req, res, next) {
  const authHdr = req.headers['authorization'] || '';
  const token   = authHdr.split(' ')[1];        // "Bearer xxx.yyy.zzz"

  if (!token) return res.sendStatus(401);       // Pas connecté

  try {
    const decoded = verifyToken(token);         // ← vérification + décodage
    req.user = decoded;                         // !!! on stocke decoded
    next();
  } catch (err) {
    console.error('JWT error →', err.message);  // log pour debug
    return res.sendStatus(403);                 // Token incorrect / expiré
  }
}

/**
 * Middleware de contrôle d’accès par rôle.
 * Exemple : app.get('/admin', authorizeRole('admin'), handler)
 */
function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.sendStatus(403);
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
