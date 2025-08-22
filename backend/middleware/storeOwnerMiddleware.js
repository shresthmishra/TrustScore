module.exports = function(req, res, next) {
  if (req.user && req.user.role === 'Store Owner') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Store owner privileges required.' });
  }
};