const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const client = require('../utils/twilio');



// 🔥 OTP generator
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};


// ✅ CREATE ORDER (SECURE)
exports.createOrder = async (req, res) => {
  return res.status(400).json({ message: "Direct order creation is disabled. Checkout must be performed through the secure Razorpay checkout flow." });
};



// ✅ GET USER ORDERS
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};



// ✅ GET ALL ORDERS (MANAGER)
exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const orders = await Order
      .find()
      .populate('user')
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: 'Error fetching all orders' });
  }
};



// ✅ UPDATE ORDER STATUS (MANAGER)
exports.updateOrderStatus = async (req, res) => {

  const { status } = req.body;

  try {

    if (req.user.role !== 'manager') {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // 🔥 SEND SMS WHEN ORDER IS READY
    // 🔥 SEND SMS WHEN ORDER IS READY
if (status === "ready") {

  // Populate user to get phone number
  const populatedOrder = await Order.findById(order._id)
    .populate('user');

  // Short order ID for cleaner display
  const shortOrderId =
    order._id.toString().slice(-6).toUpperCase();

  const message = `
Your order is ready at Luxe Dining.

Order ID: #${shortOrderId}

Pickup OTP: ${order.pickupOTP}

Please come to the counter and show this OTP to collect your order.
`;

  try {

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${order.phone || populatedOrder.user?.phone || ''}`
    });

    console.log("SMS sent successfully");

  } catch (smsError) {

    console.error(
      "SMS sending failed:",
      smsError.message
    );
  }
}

    res.json(order);

  } catch (err) {

    res.status(500).json({
      message: 'Error updating order'
    });
  }
};



// ✅ VERIFY OTP (MANAGER)
exports.verifyPickupOTP = async (req, res) => {
  const { orderId, otp } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.pickupOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    order.otpVerified = true;
    order.status = "completed";

    await order.save();

    res.json({ message: "Order verified successfully" });

  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};