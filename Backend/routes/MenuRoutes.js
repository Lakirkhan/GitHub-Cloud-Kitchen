const express = require('express');
const router = express.Router();
const menuitems = require('../controllers/menuItemController');
const verifyToken = require('../middleware/authMiddleware');

const checkVendorStatus = require('../middleware/authMiddleware');

router.post('/uploadItem',verifyToken.verifyToken,checkVendorStatus.checkVendorStatus,menuitems.upload,menuitems.uploadItem); 
router.get('/fetchItem',menuitems.getActiveItem);
router.post('/fetchItemById',menuitems.fetchItemById);
router.post('/discontinueItem',menuitems.discontinueItem);
router.get('/fetchItemPagination',menuitems.getPaginatedMenuItems);
router.post('/updateItem',verifyToken.verifyToken,menuitems.upload,menuitems.updatedItem);
router.get('/getPopularItem',menuitems.getPopularItems);
router.get('/getPopularCategory',menuitems.getPopularCategories);
router.post('/rating', menuitems.addRating);
router.get('/fetchRatingById/:menu_id', menuitems.getMenuRatings);
router.get('/fetchRating', menuitems.getAllMenuRatings);
router.get('/fetchItemByVendorId/:vendor_id',menuitems.getItemsByVendorId);
router.get('/fetchPopularItemByVendor/:vendor_id',menuitems.getPopularItemsByVendor);
router.delete('/deleteItem/:id',menuitems.deleteItem);
router.get('/fetchItemByCategory/:category_name',menuitems.getItembyCategory);
module.exports = router;
