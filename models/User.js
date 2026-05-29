

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  email: {
    type: String,
    sparse: true,
    lowercase: true
  },

  password: {
    type: String,
    required: function () {
      return this.role === 'manager';
    }
  },

  role: {
    type: String,
    enum: ['customer', 'manager'],
    default: 'customer'
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  lastLogin: Date

}, { timestamps: true });


// 🔥 HASH PASSWORD (ONLY FOR MANAGER)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// 🔥 PASSWORD CHECK
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);