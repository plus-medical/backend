const express = require('express');

const authRouter = require('./auth');
const clinicHistoriesRouter = require('./clinicHistories');
const examsRouter = require('./exams');
const laboratoriesRouter = require('./laboratories');
const usersRouter = require('./users');
const AWSUploadsRouter = require('./awsUploads');
const readFileRouter = require('./readFile');

const routes = (app) => {
  const router = express.Router();

  // app.use('/', authRouter);
  // app.use('/clinic-histories', clinicHistoriesRouter);
  // app.use('/exams', examsRouter);
  // app.use('/laboratories', laboratoriesRouter);
  // app.use('/read-file', readFileRouter);
  // app.use('/users', usersRouter);
  // app.use('/upload', AWSUploadsRouter);

  app.use('/', router);
  router.get('/', async (req, res) => {
    res.send('Hello world!');
  });
};

module.exports = routes;
