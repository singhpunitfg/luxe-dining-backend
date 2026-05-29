const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/customer-login', authController.customerLogin);
router.post('/manager-login', authController.managerLogin);



module.exports = router;