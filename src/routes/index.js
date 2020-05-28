const express = require('express');
const usersRouter = require('./users');
const authRouter = require('./auth');

const routes = (app) => {
  const router = express.Router();
  // app.use('/api/users', usersRouter);
  // app.use('/api', authRouter);

  app.use('/api', router);
  router.get('/api', async (req, res) => {
    res.send('Hello world!');
  });
};

module.exports = routes;
