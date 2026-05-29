
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },

    name: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    price: {
      type: Number,
      required: true
    },

    selectedVariant: {
      label: String,
      price: Number
    }
  }],

  totalPrice: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    enum: ['dine-in', 'takeaway'],
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },

  pickupOTP: {
    type: String,
    required: true
  },

  otpVerified: {
    type: Boolean,
    default: false
  },

  paymentStatus: {
    type: String,
    enum: ['paid'],
    default: 'paid'
  },

paymentId: String,
razorpayOrderId: String,

  cancellationAllowedTill: Date

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);