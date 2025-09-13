const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ success: false, msg: "User not authenticated" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, msg: "Access denied: insufficient permissions" });
        }

        next();
    };
};

module.exports = restrictTo;