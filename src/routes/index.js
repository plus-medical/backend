const express = require('express');
const usersRouter = require('./users');
const authRouter = require('./auth');
const AWSUploadsRouter = require('./awsUploads');
const readFileRouter = require('./readFile');

const routes = (app) => {
  const router = express.Router();
  app.use('/api/users', usersRouter);
  app.use('/api', authRouter);
  app.use('/api/upload', AWSUploadsRouter);
  app.use('/api/read-file', readFileRouter);

  app.use('/api', router);
  router.get('/api', async (req, res) => {
    res.send('Hello world!');
  });
};

module.exports = routes;
