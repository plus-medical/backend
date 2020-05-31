const express = require('express');
const usersRouter = require('./users');
const authRouter = require('./auth');
const AWSUploadsRouter = require('./awsUploads');
const readFileRouter = require('./readFile');
const generatePDFRouter = require('./generatePDF');

const routes = (app) => {
  const router = express.Router();
  app.use('/', authRouter);
  app.use('/users', usersRouter);
  app.use('/upload', AWSUploadsRouter);
  app.use('/read-file', readFileRouter);
  app.use('/pdf', generatePDFRouter);

  app.use('/', router);
  router.get('/', async (req, res) => {
    res.send('Hello world!');
  });
};

module.exports = routes;
