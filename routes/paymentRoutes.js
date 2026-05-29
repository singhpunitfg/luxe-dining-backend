const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');

const {
  createRazorpayOrder,
  verifyPaymentAndCreateOrder
} = require('../controllers/paymentController');

router.post(
  '/create-order',
  auth,
  createRazorpayOrder
);

router.post(
  '/verify',
  auth,
  verifyPaymentAndCreateOrder
);

module.exports = router;