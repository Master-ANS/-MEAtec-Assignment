const jwt = require("jsonwebtoken");
const { userModel } = require('../Model/db');

const isAuth = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, msg: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, msg: "User not found" });
        }

        req.user = { id: user._id, role: user.role }; 
        next();
    } catch (error) {
        return res.status(401).json({ success: false, msg: "Token is invalid or expired" });
    }
};

module.exports = isAuth;