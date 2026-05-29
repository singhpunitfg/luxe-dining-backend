
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: function () {
      return !this.variants || this.variants.length === 0;
    }
  },

  variants: [{
    label: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],

  category: {
    type: String,
    required: true,
    enum: [
      'Soups', 'Appetizers', 'Snacks', 'Main Course', 'Rice & Biryani',
      'Breads', 'Pasta & Pizza', 'Noodles & Fried Rice', 'Breakfast',
      'Beverages', 'Desserts', 'Shakes & Juices'
    ]
  },

  isVeg: {
    type: Boolean,
    default: true
  },

  isPopular: {
    type: Boolean,
    default: false
  },

  image: {
    type: String
  },

  isAvailable: {
    type: Boolean,
    default: true
  },

  preparationTime: Number

}, { timestamps: true });

menuItemSchema.index({ category: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);