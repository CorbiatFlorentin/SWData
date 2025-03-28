const { verifyToken } = require('../config/jwt-config');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (err) {
        res.sendStatus(403);
    }
}

function authorizeRole(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) return res.sendStatus(403);
        next();
    };
}

module.exports = { authenticateToken, authorizeRole };
