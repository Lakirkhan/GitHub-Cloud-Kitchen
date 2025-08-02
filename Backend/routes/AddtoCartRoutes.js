const express = require('express');
const router = express.Router();
const addToCartController = require('../controllers/addToCartController');
const verifyUserOrIP = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/authMiddleware');


router.post('/addtoCart', optionalAuth.optionalAuth, addToCartController.addToCart);
router.get('/cartItems',verifyUserOrIP.verifyUserOrIP, addToCartController.getCartItems);
router.post('/updateCartQuantity',optionalAuth.optionalAuth, verifyUserOrIP.verifyUserOrIP, addToCartController.updateCartQuantity);
router.delete('/clearCart',optionalAuth.optionalAuth, verifyUserOrIP.verifyUserOrIP, addToCartController.clearCart);

module.exports = router;
