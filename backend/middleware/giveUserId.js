require('dotenv').config({ path: "./config/config.env" });
const jwt = require('jsonwebtoken');
const { userModel } = require('../Model/db');

// Middleware to extract user info from JWT
const giveUserId = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({
            success: false,
            msg: "User not authorized"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (error){
        return res.status(401).json({
            success: false,
            msg: "Invalid or expired token"
        });
    }
};

// Middleware to verify user role
const verifyRole = (allowedRoles) => {
    return async (req, res, next) => {
        const { id } = req.user;
        const user = await userModel.findById(id);
        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                msg: "Access denied"
            });
        }
        next();
    };
};

module.exports = { giveUserId, verifyRole };
