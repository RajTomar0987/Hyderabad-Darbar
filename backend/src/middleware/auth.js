const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../data/db');
const { verifyFirebaseToken, setAdminCustomClaim } = require('../config/firebase');

/**
 * Middleware to require valid Firebase Authentication (Customer or Admin)
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is missing. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded = null;

    // 1. Try verifying with Firebase Admin SDK
    try {
      decoded = await verifyFirebaseToken(token);
    } catch (fbErr) {
      // 2. Fallback check for signed JWT if operating in development/migration mode
      try {
        decoded = jwt.verify(token, config.jwtSecret);
      } catch (jwtErr) {
        if (fbErr.code === 'auth/id-token-expired' || jwtErr.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Authentication session expired. Please sign in again.'
          });
        }
        return res.status(401).json({
          success: false,
          message: 'Invalid or unauthorized Firebase authentication token: ' + fbErr.message
        });
      }
    }

    const uid = decoded.uid || decoded.user_id || decoded.id;
    const email = (decoded.email || '').toLowerCase().trim();
    const name = decoded.name || decoded.displayName || 'Customer';

    // Admin authorization checks:
    // 1. Firebase Admin custom claim on token (decoded.admin === true or decoded.role === 'admin')
    // 2. Configured admin email on Render (config.admin.email)
    const hasAdminClaim = decoded.admin === true || decoded.role === 'admin';
    const adminEmail = (config.admin.email || 'admin@hyderabaddarbar.com').toLowerCase().trim();
    const isConfiguredAdmin = email && email === adminEmail;

    // If configured admin email logs in without custom claims yet, assign admin claim
    if (isConfiguredAdmin && !hasAdminClaim) {
      setAdminCustomClaim(uid, true).catch(() => {});
    }

    const role = (hasAdminClaim || isConfiguredAdmin) ? 'admin' : null;

    // Sync or lookup user record in database
    const user = await db.syncFirebaseUser({
      firebase_uid: uid,
      email,
      name,
      role
    });

    req.user = {
      id: user.id,
      uid: user.firebase_uid,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication verification failed: ' + error.message
    });
  }
};

/**
 * Middleware to require Admin privileges
 */
const requireAdmin = async (req, res, next) => {
  await requireAuth(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required.'
      });
    }
  });
};

/**
 * Middleware for optional authentication
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      let decoded = null;
      try {
        decoded = await verifyFirebaseToken(token);
      } catch {
        try {
          decoded = jwt.verify(token, config.jwtSecret);
        } catch {
          decoded = null;
        }
      }

      if (decoded) {
        const uid = decoded.uid || decoded.user_id || decoded.id;
        const email = (decoded.email || '').toLowerCase().trim();
        const hasAdminClaim = decoded.admin === true || decoded.role === 'admin';
        const adminEmail = (config.admin.email || 'admin@hyderabaddarbar.com').toLowerCase().trim();
        const role = (hasAdminClaim || email === adminEmail) ? 'admin' : null;

        const user = await db.syncFirebaseUser({
          firebase_uid: uid,
          email,
          name: decoded.name || decoded.displayName || 'Customer',
          role
        });
        if (user) {
          req.user = {
            id: user.id,
            uid: user.firebase_uid,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: user.role
          };
        }
      }
    }
  } catch {
    // Ignore invalid tokens for optional routes
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  optionalAuth
};
