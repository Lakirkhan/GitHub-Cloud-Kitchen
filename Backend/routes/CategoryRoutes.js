const express = require('express');
const router = express.Router();
const category = require('../controllers/categoryController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/authMiddleware');

router.post('/uploadCategory', verifyToken.verifyToken,category.upload,category.addCategory);
router.get('/fetchCategory', category.fetchCategory);
router.post('/updateCategory', verifyAdmin.verifyAdmin,category.upload, category.updateCategory);
router.get('/pendingCategories',verifyToken.verifyToken, category.getVendorCategories);
router.post('/categoryReview',  verifyToken.verifyToken, verifyAdmin.verifyAdmin,category.reviewCategory);

module.exports = router;
