const MenuItem = require('../models/MenuItem');


// 🔥 GET ALL MENU ITEMS
exports.getMenu = async (req, res) => {
  try {
    const query = req.query.all === 'true' ? {} : { isAvailable: true };
    const menu = await MenuItem.find(query)
      .sort({ category: 1 });

    res.json(menu);

  } catch (err) {
    res.status(500).json({ message: 'Error fetching menu' });
  }
};


// 🔥 CREATE MENU ITEM (MANAGER ONLY)
exports.createMenuItem = async (req, res) => {
  try {
    const item = new MenuItem(req.body);

    await item.save();

    res.status(201).json(item);

  } catch (err) {
    res.status(500).json({ message: 'Error creating menu item' });
  }
};


// 🔥 UPDATE MENU ITEM
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(item);

  } catch (err) {
    res.status(500).json({ message: 'Error updating item' });
  }
};


// 🔥 UPDATE MENU ITEM AVAILABILITY (MANAGER ONLY)
exports.updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    if (isAvailable === undefined) {
      return res.status(400).json({ message: 'isAvailable state is required' });
    }

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(item);

  } catch (err) {
    res.status(500).json({ message: 'Error updating availability' });
  }
};


// 🔥 DELETE MENU ITEM
exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};