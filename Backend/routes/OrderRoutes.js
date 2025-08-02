const express = require('express');
const router = express.Router();
const { fetchOrderHistory, fetchOrderHistoryById, upload ,orderHistory, countTotalOrders, countTotalRevenue, countTodayOrders, countTodayRevenue, getOrderStatus, UpdateOrderStatus, cancelOrderAndRefund, getOrderHistoryByVendor } = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/orderHistory',upload.single('file'),verifyToken.verifyToken,orderHistory); 
router.get('/fetchHistory',fetchOrderHistory);
router.get('/fechHistoryById',verifyToken.verifyToken,fetchOrderHistoryById);
router.get('/totalOrder/:vendorId',countTotalOrders);
router.get('/totalRevenue/:vendorId',countTotalRevenue);
router.get('/getTodayOrder/:vendorId',countTodayOrders);
router.get('/getTodayRevenue/:vendorId',countTodayRevenue);
router.get('/getOrderStatus',getOrderStatus );
router.post('/cancelOrder', verifyToken.verifyToken, cancelOrderAndRefund);
router.post("/updateOrderStatus", UpdateOrderStatus);
router.get('/orderHistoryByVendorId/:vendorId', getOrderHistoryByVendor);

module.exports = router;
