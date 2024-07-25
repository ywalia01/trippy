// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
import User from '../models/User';

const authMiddleware = async (req, res, next) => {
  let token;
  token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    req.user = user;

    req.body.user = decoded.id;

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
