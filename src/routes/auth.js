const express = require('express');
const UsersService = require('../services/users');
const auth = require('../utils/middlewares/auth');

const usersService = new UsersService();

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { body: credentials } = req;
  try {
    const { token } = await usersService.signinService(credentials);
    res.status(200).json({ data: { token }, message: 'Successfully authenticated' });
  } catch (err) {
    next(err);
  }
});

router.get('/test', auth, async (req, res, next) => {
  console.log('body', req.body);
  console.log('user', req.user);
  try {
    res.status(200).json({ message: 'Hello from singin test' });
  } catch (err) {
    next();
  }
});

module.exports = router;
