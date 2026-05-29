
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


// Load env
dotenv.config();

// Routes
const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();


// 🔥 ENV VARIABLES
const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://cafe:cafe@cafe.oeycrp8.mongodb.net/';


// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());


// 🔥 ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/auth', otpRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// 🔥 HEALTH CHECK
app.get('/', (req, res) => {
  res.send('Luxe Dining API is running...');
});


// 🔥 GLOBAL ERROR HANDLER (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});


// 🔥 DATABASE CONNECTION
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });