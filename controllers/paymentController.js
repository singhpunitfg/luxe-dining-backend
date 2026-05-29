const razorpay = require('../utils/razorpay');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const crypto = require('crypto');

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

exports.createRazorpayOrder = async (req, res) => {
  try {

    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: 'Cart is empty'
      });
    }

    const menuItems = await MenuItem.find({
      _id: { $in: items.map(i => i.menuItem) }
    });

    let totalPrice = 0;

    for (const item of items) {

      const menuItem = menuItems.find(
        m => m._id.toString() === item.menuItem
      );

      if (!menuItem) {
        return res.status(400).json({
          message: 'Invalid menu item'
        });
      }

      let price = menuItem.price;

      if (item.selectedVariant) {

        const variant = menuItem.variants.find(
          v =>
            v.label ===
            (
              typeof item.selectedVariant === 'string'
                ? item.selectedVariant
                : item.selectedVariant.label
            )
        );

        if (!variant) {
          return res.status(400).json({
            message: 'Invalid variant'
          });
        }

        price = variant.price;
      }

      totalPrice += price * item.quantity;
    }

    const options = {
      amount: totalPrice * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const razorpayOrder =
      await razorpay.orders.create(options);

    res.json({
      success: true,
      amount: totalPrice,
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrder
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Failed to create payment order'
    });
  }
};

exports.verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderData
    } = req.body;

    console.log("Payment verification requested:", {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    });

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing Razorpay payment credentials' });
    }

    // Verify signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      console.error("Signature verification failed. Expected:", digest, "Got:", razorpay_signature);
      return res.status(400).json({ message: 'Transaction is not authentic' });
    }

    console.log("✅ Razorpay payment verified successfully.");

    if (!orderData) {
      return res.status(400).json({ message: 'Missing order data for creation' });
    }

    const { items, type, phone } = orderData;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Get menu items from DB
    const menuItems = await MenuItem.find({
      _id: { $in: items.map(i => i.menuItem) }
    });

    let totalPrice = 0;

    const validatedItems = items.map(item => {
      const menuItem = menuItems.find(
        m => m._id.toString() === item.menuItem
      );

      if (!menuItem) {
        throw new Error(`Invalid menu item referenced: ${item.menuItem}`);
      }

      let price = menuItem.price;
      let variantLabel = '';

      if (item.selectedVariant) {
        if (typeof item.selectedVariant === 'string') {
          variantLabel = item.selectedVariant;
        } else if (typeof item.selectedVariant === 'object') {
          variantLabel = item.selectedVariant.label;
        }
      }

      if (menuItem.variants && menuItem.variants.length > 0) {
        if (!variantLabel) {
          throw new Error(`Please select a size/variant for ${menuItem.name}`);
        }

        const variant = menuItem.variants.find(
          v => v.label.toLowerCase() === variantLabel.toLowerCase()
        );

        if (!variant) {
          throw new Error(`Invalid variant '${variantLabel}' selected for ${menuItem.name}`);
        }

        price = variant.price;
      } else {
        if (variantLabel) {
          throw new Error(`Variants are not supported for item ${menuItem.name}`);
        }
      }

      if (price === undefined || price === null || typeof price !== 'number' || isNaN(price)) {
        throw new Error(`Pricing error: Could not resolve valid price for item ${menuItem.name}`);
      }

      const itemQuantity = Number(item.quantity);
      if (isNaN(itemQuantity) || itemQuantity <= 0) {
        throw new Error(`Invalid quantity for item ${menuItem.name}`);
      }

      totalPrice += price * itemQuantity;

      return {
        menuItem: menuItem._id,
        name: menuItem.name,
        price: price,
        quantity: itemQuantity,
        selectedVariant: variantLabel ? {
          label: variantLabel,
          price: price
        } : null
      };
    });

    const otp = generateOTP();

    const order = new Order({
      user: userId,
      items: validatedItems,
      totalPrice,
      type,
      phone,
      pickupOTP: otp,
      otpVerified: false,
      status: 'pending',
      paymentStatus: 'paid',
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      cancellationAllowedTill: new Date(Date.now() + 5 * 60 * 1000)
    });

    await order.save();
    console.log("✅ MongoDB Order created successfully. Order ID:", order._id);

    res.status(201).json({
      success: true,
      message: "Order placed and paid successfully",
      orderId: order._id,
      totalPrice,
      otp
    });

  } catch (err) {
    console.error("Error creating order after payment verification:", err);
    res.status(500).json({ message: err.message || 'Error creating order' });
  }
};