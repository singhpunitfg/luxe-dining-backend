const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phone: String,
  otp: String,
  expiresAt: {
    type: Date,
    index: { expires: 0 } // 🔥 auto delete
  }
}, { timestamps: true });

module.exports = mongoose.model('OTP', otpSchema);