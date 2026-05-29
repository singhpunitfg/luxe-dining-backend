const express = require('express');
const router = express.Router();

const {
  getMenu,
  createMenuItem,
  updateMenuItem,
  updateAvailability,
  deleteMenuItem
} = require('../controllers/menuController');

const { auth, manager } = require('../middleware/authMiddleware');


// 🔥 PUBLIC
router.get('/', getMenu);


// 🔥 MANAGER ONLY
router.post('/', auth, manager, createMenuItem);
router.put('/:id', auth, manager, updateMenuItem);
router.patch('/:id/availability', auth, manager, updateAvailability);
router.delete('/:id', auth, manager, deleteMenuItem);

module.exports = router;