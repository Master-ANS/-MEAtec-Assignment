const express = require('express');
const router = express.Router();
const authController = require('../controller/userAuth'); 
const isAuth = require("../middleware/isAuth");


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/verify-email', isAuth, authController.verifyEmail);
router.post('/send-verify-otp',isAuth , authController.sendVerifyOtp);
router.post('/send-password-reset-otp',isAuth, authController.sendPasswordResetOtp);
router.post('/reset-password', isAuth , authController.resetPassword);
router.get('/verify-token', authController.verifyToken); 

module.exports = router;
