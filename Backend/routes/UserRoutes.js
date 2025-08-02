const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');


router.post('/verifyEmail',userController.verifyEmail);
router.post('/sendOtp',userController.sendOtp);
router.post('/verifyOtp',userController.verifyOtp);
router.post('/login',userController.loginUser);
router.post('/sendVerificationCode',userController.sendResetCode);
router.post('/verifyCode',userController.verifyCode);
router.post('/savePassword',userController.savePassword);
router.post('/logout',verifyToken.verifyToken,userController.logout);
router.get('/getAllUser',userController.getAllUser);
router.get('/getUserById',verifyToken.verifyToken,userController.getUserById);
router.post('/updateProfile',verifyToken.verifyToken,userController.editUserProfile);

module.exports = router;