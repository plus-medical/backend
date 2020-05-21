const express = require('express');
const UsersService = require('../services/users');

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

module.exports = router;
