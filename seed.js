const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const dotenv = require('dotenv');

dotenv.config();

const items = [
  // Soups
  { name: 'Tomato Soup', description: 'Creamy tomato soup served with croutons.', price: 110, category: 'Soups', isVeg: true, isPopular: false },
  { name: 'Manchow Soup (Veg)', description: 'Spicy soy-based soup with vegetables and crispy noodles.', price: 130, category: 'Soups', isVeg: true, isPopular: true },
  { name: 'Manchow Soup (Non-Veg)', description: 'Spicy soy-based soup with chicken and crispy noodles.', price: 150, category: 'Soups', isVeg: false, isPopular: false },

  // Appetizers
  { name: 'Paneer Tikka', description: 'Grilled chunks of paneer marinated in spices.', price: 280, category: 'Appetizers', isVeg: true, isPopular: true, image: 'https://images.unsplash.com/photo-1599487483443-214446b5e672?q=80&w=800' },
  { name: 'Chicken 65', description: 'Spicy, deep-fried chicken pieces.', price: 320, category: 'Appetizers', isVeg: false, isPopular: true },
  { name: 'Hara Bhara Kabab', description: 'Deep-fried patties of spinach and peas.', price: 240, category: 'Appetizers', isVeg: true, isPopular: false },

  // Snacks (Momos)
  { 
    name: 'Veg Steamed Momos', 
    description: 'Steamed dumplings filled with seasoned vegetables.', 
    variants: [{ label: 'Half', price: 90 }, { label: 'Full', price: 160 }],
    category: 'Snacks', isVeg: true, isPopular: true 
  },
  { 
    name: 'Chicken Paneer Momos', 
    description: 'Dumplings filled with chicken and paneer mix.', 
    variants: [{ label: 'Half', price: 110 }, { label: 'Full', price: 200 }],
    category: 'Snacks', isVeg: false, isPopular: false 
  },

  // Main Course
  { name: 'Dal Makhani', description: 'Creamy black lentils slow-cooked overnight.', price: 260, category: 'Main Course', isVeg: true, isPopular: true },
  { name: 'Paneer Butter Masala', description: 'Paneer cubes in a rich tomato and butter gravy.', price: 310, category: 'Main Course', isVeg: true, isPopular: true },
  { name: 'Butter Chicken', description: 'Tender chicken in a rich, creamy tomato gravy.', price: 380, category: 'Main Course', isVeg: false, isPopular: true },
  { name: 'Mutton Rogan Josh', description: 'Traditional Kashmiri lamb curry.', price: 450, category: 'Main Course', isVeg: false, isPopular: false },

  // Rice & Biryani
  { 
    name: 'Veg Biryani', 
    description: 'Fragrant basmati rice cooked with vegetables and spices.', 
    variants: [{ label: 'Half', price: 180 }, { label: 'Full', price: 320 }],
    category: 'Rice & Biryani', isVeg: true, isPopular: true 
  },
  { 
    name: 'Chicken Dum Biryani', 
    description: 'Aromatic rice layered with spiced chicken.', 
    variants: [{ label: 'Half', price: 220 }, { label: 'Full', price: 400 }],
    category: 'Rice & Biryani', isVeg: false, isPopular: true 
  },

  // Breads
  { name: 'Tandoori Roti', description: 'Whole wheat bread baked in clay oven.', price: 30, category: 'Breads', isVeg: true, isPopular: false },
  { name: 'Butter Naan', description: 'Leavened bread with a brush of butter.', price: 60, category: 'Breads', isVeg: true, isPopular: true },
  { name: 'Garlic Naan', description: 'Naan topped with minced garlic.', price: 75, category: 'Breads', isVeg: true, isPopular: false },

  // Pasta & Pizza
  { name: 'Margherita Pizza', description: 'Simple pizza with tomato sauce and mozzarella.', price: 290, category: 'Pasta & Pizza', isVeg: true, isPopular: true },
  { name: 'White Sauce Pasta', description: 'Pasta in a creamy alfredo sauce.', price: 260, category: 'Pasta & Pizza', isVeg: true, isPopular: false },

  // Noodles & Fried Rice
  { name: 'Hakka Noodles', description: 'Stir-fried noodles with crisp vegetables.', price: 190, category: 'Noodles & Fried Rice', isVeg: true, isPopular: true },
  { name: 'Veg Fried Rice', description: 'Basmati rice stir-fried with seasonal veggies.', price: 180, category: 'Noodles & Fried Rice', isVeg: true, isPopular: false },

  // Breakfast
  { name: 'Aloo Paratha', description: 'Wheat flatbread stuffed with spiced potatoes.', price: 90, category: 'Breakfast', isVeg: true, isPopular: true },
  { name: 'Paneer Paratha', description: 'Flatbread stuffed with crumbled paneer.', price: 120, category: 'Breakfast', isVeg: true, isPopular: false },

  // Beverages
  { name: 'Masala Tea', description: 'Spiced Indian tea with milk.', price: 40, category: 'Beverages', isVeg: true, isPopular: true },
  { name: 'Cold Coffee', description: 'Iced coffee blended with milk and sugar.', price: 110, category: 'Beverages', isVeg: true, isPopular: false },
  { name: 'Fresh Lime Soda', description: 'Refreshing lime soda with mint.', price: 80, category: 'Beverages', isVeg: true, isPopular: false },

  // Desserts
  { name: 'Gulab Jamun (2 pcs)', description: 'Deep-fried syrup-soaked milk dumplings.', price: 80, category: 'Desserts', isVeg: true, isPopular: true },
  { name: 'Moong Dal Halwa', description: 'Traditional dessert made with lentils and ghee.', price: 120, category: 'Desserts', isVeg: true, isPopular: false },

  // Shakes & Juices
  { name: 'Chocolate Shake', description: 'Thick shake with dark chocolate sauce.', price: 150, category: 'Shakes & Juices', isVeg: true, isPopular: true },
  { name: 'Fresh Watermelon Juice', description: 'Chilled juice from fresh watermelon.', price: 130, category: 'Shakes & Juices', isVeg: true, isPopular: false }
];

const seedDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurantSite';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');
    
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(items);
    
    console.log('Database seeded successfully with ' + items.length + ' items.');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
