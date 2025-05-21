// middleware/auth.js
const { verifyToken } = require('../config/jwt-config');


function authenticateToken(req, res, next) {
  const authHdr = req.headers['authorization'] || '';
  const token   = authHdr.split(' ')[1];       
  if (!token) return res.sendStatus(401);       

  try {
    const decoded = verifyToken(token);         
    req.user = decoded;                         
    next();
  } catch (err) {
    console.error('JWT error →', err.message);  
    return res.sendStatus(403);                 
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
