const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return next(); // No token, just continue
  }

  try {
    const token = authHeader.split(' ')[1];
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    // Invalid token, but we don't want to block the request
    next();
  }
};