// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.adminId) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized. Please login.' });
}

// Check if already authenticated (for login page)
function isNotAuthenticated(req, res, next) {
    if (req.session && req.session.adminId) {
        return res.redirect('/admin/dashboard.html');
    }
    next();
}

module.exports = {
    isAuthenticated,
    isNotAuthenticated
};
