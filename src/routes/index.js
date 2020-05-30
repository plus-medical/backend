const express = require('express');
const usersRouter = require('./users');
const authRouter = require('./auth');

const routes = (app) => {
  const router = express.Router();
  app.use('/users', usersRouter);
  app.use('/', authRouter);

  app.use('/', router);
  router.get('/', async (req, res) => {
    res.send('Hello world!');
  });
};

module.exports = routes;
