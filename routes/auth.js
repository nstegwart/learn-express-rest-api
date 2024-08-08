const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user', authMiddleware, authController.getUser);
router.post('/verify-otp', authMiddleware, authController.verifyOTP)
router.post('/resend-otp', authMiddleware, authController.resendOTP);


module.exports = router;
