const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

// Register
router.route('/register')
  .get(users.renderRegisterForm)
  .post(catchAsync(users.register));


// Login
router.route('/login')
  .get(users.renderLoginForm)
  .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

// Logout
router.get('/logout', users.logout);

module.exports = router;
