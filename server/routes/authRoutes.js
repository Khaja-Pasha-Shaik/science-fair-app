const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route for signup form submission
router.post('/signup', authController.signup);

module.exports = router;
