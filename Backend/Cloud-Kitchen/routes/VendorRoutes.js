const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/authMiddleware');

router.post('/vendorSendOtp',vendorController.upload,vendorController.vendorSendOtp);
router.post('/vendorVerifyOtp',vendorController.vendorVerifyOtp);
router.post('/vendorLogin',vendorController.vendorLogin);
router.post('/vendorSendVerificationCode',vendorController.vendorSendResetCode);
router.post('/vendorVerifyCode',vendorController.vendorVerifyCode);
router.post('/vendorSavePassword',vendorController.saveVendorPassword);
router.post('/vendorLogout',verifyToken.verifyToken,vendorController.vendorLogout);
router.post('/vendorUpdateProfile',verifyToken.verifyToken,vendorController.upload,vendorController.editVendorProfile);
router.get('/getVendorById/:vendor_id', vendorController.getVendorById);
router.get('/getAllVendor',vendorController.getAllVendor);
router.get('/pendingVendor',vendorController.getPendingVendor);
router.get('/getVendorStatus',vendorController.getVendorStatus);
router.post('/approveVendor',verifyAdmin.verifyAdmin,vendorController.approveVendor);
router.post('/vendorRating',vendorController.addVendorRating);
router.get('/fetchRatingByVendorId/:vendor_id', vendorController.getVendorRatings);
router.get('/fetchRatingByVendor', vendorController.getAllVendorRatings);
router.delete('/vendorDelete/:vendor_id',  vendorController.deleteVendorAndMenu);
module.exports = router;

