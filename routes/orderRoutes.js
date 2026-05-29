const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const { auth, manager } = require('../middleware/authMiddleware');


// 👤 CUSTOMER
router.post('/', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getOrders);


// 🛠️ MANAGER
router.get('/all', auth, manager, orderController.getAllOrders);
router.patch('/:id/status', auth, manager, orderController.updateOrderStatus);


// 🔥 NEW (IMPORTANT)
router.post('/verify-otp', auth, manager, orderController.verifyPickupOTP);

module.exports = router;