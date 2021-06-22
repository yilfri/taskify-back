// Route user auth
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Login User
// api/auth
router.post('/', authController.authUser);

// Getting Authenticated user
router.get('/', auth, authController.userAuthenticated);

module.exports = router;
