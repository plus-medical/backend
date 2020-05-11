const express = require('express');

const initialRoutes = (app) => {
  const router = express.Router();
  app.use('/api/', router);

  router.get('/', async (req, res) => {
    res.send('Hello world!');
  });
};

module.exports = initialRoutes;
