const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/addAddress', verifyToken.verifyToken, addressController.addAddress);
router.get('/getAddressDetailById',verifyToken.verifyToken, addressController.fetchAddressDetailById);
router.post('/updateAddress',verifyToken.verifyToken,addressController.updateAddress);
router.delete('/clearAddress',verifyToken.verifyToken,addressController.deleteAddress);

module.exports = router;
