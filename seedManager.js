const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://cafe:cafe@cafe.oeycrp8.mongodb.net/';

const seedManager = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'manager@luxedining.com';
    const password = 'password123';
    const phone = '9999999999';

    // Check if manager already exists
    const existingManager = await User.findOne({ email, role: 'manager' });

    if (existingManager) {
      console.log(`⚠️ Manager account already exists: ${email}`);
      process.exit(0);
    }

    // Create a new manager account
    const manager = new User({
      phone,
      email,
      password,
      role: 'manager',
      isVerified: true
    });

    await manager.save();
    console.log(`🎉 Manager account successfully created!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding manager:', err);
    process.exit(1);
  }
};

seedManager();
