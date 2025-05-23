// middleware/auth.js
const { verifyToken } = require("../config/jwt-config");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, pseudo: payload.pseudo, role: payload.role };
    next();
  } catch (err) {
    const code = err.name === "TokenExpiredError" ? 401 : 401;
    return res.status(code).json({ error: err.name === "TokenExpiredError"
      ? "Session expirée, veuillez vous reconnecter."
      : "Token invalide."
    });
  }
}

/**
 * Middleware de contrôle d’accès par rôle.
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
