const db = require('../models');
const User = db.User;

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];

    if (!token) {
      // Redirect to login if no token provided
      return res.redirect('/api/login');
    }

    const user = await User.findOne({ where: { personal_token: token } });

    if (!user) {
      // Redirect to login if token invalid
      return res.redirect('/api/login');
    }

    // Attach user info to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authMiddleware;
