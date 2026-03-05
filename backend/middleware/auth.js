const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "chatcart-dev-secret";

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    req.accountOwnerId = payload.ownerUserId || payload.id;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

function requireOwner(req, res, next) {
  if (!req.user || req.user.isStaff) {
    return res.status(403).json({ message: "Only account owners can perform this action." });
  }

  return next();
}

function requirePermission(permission) {
  return function permissionGuard(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    if (!req.user.isStaff) {
      return next();
    }

    const permissions = Array.isArray(req.user.permissions) ? req.user.permissions : [];
    if (!permissions.includes(permission)) {
      return res.status(403).json({ message: `Missing permission: ${permission}.` });
    }

    return next();
  };
}

function requireRole(...roles) {
  return function roleGuard(req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have access to this resource." });
    }

    return next();
  };
}

module.exports = {
  authRequired,
  requireRole,
  requireOwner,
  requirePermission,
  JWT_SECRET
};
