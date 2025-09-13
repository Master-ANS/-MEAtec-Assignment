const { userModel } = require('../Model/db');
require('dotenv').config({ path: './config/config.env' });
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const transporter = require('../Model/nodeMailer');

// Register endpoint
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            msg: "Missing required fields"
        });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = new userModel({ name, email, password: hashedPassword, role });
        await user.save();
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Battery Passport",
            text: "Registration successful!"
        };
        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            success: true,
            msg: "User registered successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};

// Login endpoint
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            msg: "Missing email or password"
        });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "Invalid email or password"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                msg: "Invalid email or password"
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            msg: "Logged in successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};

// Logout endpoint
const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            path: '/',
        });
        return res.status(200).json({
            success: true,
            msg: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};

// Send verify OTP
const sendVerifyOtp = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await userModel.findById(id);
        if (user.isAccountVerified) {
            return res.status(400).json({
                success: false,
                msg: "User already verified"
            });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const mailOptions = { 
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Email Verification",
            text: `Your OTP for email verification is ${otp}`
        };
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            msg: "OTP sent successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};

// Verify email OTP
const verifyEmail = async (req, res) => {
    const { otp } = req.body;
    const { id } = req.user;
    if (!otp) {
        return res.status(400).json({
            success: false,
            msg: "OTP required"
        });
    }
    try {
        const user = await userModel.findById(id);
        if (!user || user.verifyOtp !== otp || user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({
                success: false,
                msg: "Invalid or expired OTP"
            });
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = null;
        await user.save();

        return res.status(200).json({
            success: true,
            msg: "Email verified successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};

// Send password reset OTP
const sendPasswordResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            success: false,
            msg: "Email required"
        });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}`
        };
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            msg: "Reset OTP sent"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            msg: "Incomplete details"
        });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user || user.resetOtp !== otp || user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({
                success: false,
                msg: "Invalid or expired OTP"
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = null;
        await user.save();

        return res.status(200).json({
            success: true,
            msg: "Password reset successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};

// Verify token endpoint (for other services)
const verifyToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({
            success: false,
            msg: "Token required"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "Unauthorized"
            });
        }
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                role: user.role,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            msg: "Invalid or expired token"
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    sendVerifyOtp,
    verifyEmail,
    sendPasswordResetOtp,
    resetPassword,
    verifyToken
};
