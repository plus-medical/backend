const express = require('express');
const UsersService = require('../services/users');
const auth = require('../utils/middlewares/auth');
const { config } = require('../config');
const { nextMonth } = require('../utils/dates');
const validationHandler = require('../utils/middlewares/validationHandler');
const { signinSchema } = require('../utils/validationSchemas/users');

const usersService = new UsersService();

const router = express.Router();

router.post(
  '/signin',
  validationHandler(signinSchema),
  async (req, res, next) => {
    const { body: credentials } = req;
    try {
      const { token, user } = await usersService.signinService(credentials);
      res
        .cookie('token', token, {
          httpOnly: !config.dev,
          secure: !config.dev,
          expires: nextMonth(),
        })
        .status(200)
        .json({ data: { user }, message: 'Successfully authenticated' });
    } catch (err) {
      next(err);
    }
  },
);

router.post('/logout', (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'Session finished' });
});

router.get('/test', auth(), async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Hello from singin test' });
  } catch (err) {
    next();
  }
});

module.exports = router;
