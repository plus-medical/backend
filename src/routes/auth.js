const express = require('express');
const UsersService = require('../services/users');
const auth = require('../utils/middlewares/auth');
const { config } = require('../config');
const { nextMonth } = require('../utils/dates');

const usersService = new UsersService();

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { body: credentials } = req;
  try {
    const { token } = await usersService.signinService(credentials);
    res.cookie('token', token, {
      httpOnly: !config.dev,
      secure: !config.dev,
      expires: nextMonth(),
    }).status(200).json({ message: 'Successfully authenticated' });
  } catch (err) {
    next(err);
  }
});

router.get('/test', auth(), async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Hello from singin test' });
  } catch (err) {
    next();
  }
});

module.exports = router;
