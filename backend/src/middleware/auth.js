const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'finora_super_secret_jwt_key_2026';

/**
 * Authentication Middleware
 * Validates JWT Bearer tokens and derives authenticated user identity.
 * Enforces server-side authorization: never trust user-supplied IDs in body or params.
 */
const requireAuth = (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'].trim();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication token missing. Please sign in to continue.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or expired authentication token.'
      });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Your session has expired. Please log in again.'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid authentication token.'
    });
  }
};

/**
 * Helper to generate JWT token for a user
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id ? user._id.toString() : user.id,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  requireAuth,
  generateToken,
  JWT_SECRET
};
