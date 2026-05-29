const jwt = require('jsonwebtoken');
const User = require('../models/User');
const client = require('../utils/twilio');

exports.sendOTP = async (req, res) => {
  const { phone } = req.body;

  try {
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: `+91${phone}`,
        channel: 'sms'
      });

    res.json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
};

exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp
      });

    if (verificationCheck.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        role: 'customer'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.json({
      success: true,
      token,
      user
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'OTP verification failed'
    });
  }
};