module.exports = function(req, res, next) {
    if (req.user && req.user.role === 'System Administrator') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }
};