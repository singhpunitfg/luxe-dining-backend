
const jwt = require('jsonwebtoken');


// 🔐 AUTH MIDDLEWARE
const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


// 🔐 MANAGER ROLE CHECK
const manager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Access denied: Manager only' });
  }

  next();
};


module.exports = { auth, manager };