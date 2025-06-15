const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: No user found' });
      }
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient role' });
      }
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

module.exports = roleMiddleware;
