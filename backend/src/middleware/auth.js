// src/middleware/auth.js - JWT authentication middleware
const jwt = require('jsonwebtoken');

/**
 * Protect routes - verifies JWT and attaches user to req.
 * Optionally restricts to specific roles.
 * Usage: auth()           → any authenticated user
 *        auth('owner')    → only owners
 *        auth(['customer', 'owner']) → both
 */
const auth = (roles) => {
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    const header = req.header('Authorization');
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const token = header.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role, iat, exp }

      if (roles && roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied for this role' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token is invalid or expired' });
    }
  };
};

module.exports = auth;
