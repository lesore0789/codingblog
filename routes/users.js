const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

// Register
router.get('/register', users.renderRegisterForm);

router.post('/register', catchAsync(users.register));


// Login
router.get('/login', users.renderLoginForm);

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

// Logout
router.get('/logout', users.logout);

module.exports = router;
