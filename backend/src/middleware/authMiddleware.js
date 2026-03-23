const { verifyAccessToken } = require('../utils/tokenUtils');
const { sendUnauthorized } = require('../utils/apiResponse');
const userRepository = require('../repositories/UserRepository');

/**
 * Protect routes — validates JWT and attaches req.user.
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendUnauthorized(res, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await userRepository.findById(decoded.id);
    if (!user) return sendUnauthorized(res, 'User no longer exists');
    if (!user.isActive) return sendUnauthorized(res, 'Account is deactivated');

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendUnauthorized(res, 'Token expired');
    }
    return sendUnauthorized(res, 'Invalid token');
  }
};

/**
 * Role guard factory — use after requireAuth.
 * @param {...string} roles - Allowed roles
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return sendUnauthorized(res);
    if (!roles.includes(req.user.role)) {
      const { sendForbidden } = require('../utils/apiResponse');
      return sendForbidden(res, `Access denied. Required role(s): ${roles.join(', ')}`);
    }
    next();
  };
};

module.exports = { requireAuth, requireRole };
