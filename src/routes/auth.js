const express = require('express');
const AuthService = require('../services/auth');
const { config } = require('../config');
const { nextMonth } = require('../utils/dates');
const validationHandler = require('../utils/middlewares/validationHandler');
const { signinSchema } = require('../utils/validationSchemas/users');
// const readFile = require('../utils/functions/readFile');

const authService = new AuthService();

const router = express.Router();

router.post(
  '/signin',
  validationHandler(signinSchema),
  async (req, res, next) => {
    const { body: credentials } = req;
    try {
      const { token, user } = await authService.signIn(credentials);
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

// router.post('/test', async (req, res, next) => {
//   try {
//     const users = await readFile(req.file.path);
//     console.log(users);
//     res.status(200).json({ message: 'File uploaded!' });
//   } catch (err) {
//     next();
//   }
// });

module.exports = router;
