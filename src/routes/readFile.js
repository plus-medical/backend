const express = require('express');
const readFile = require('../utils/functions/readFile');

const router = express.Router();

router.post('/', (req, res, next) => {
  try {
    const users = readFile(req.file);
    console.log('users', users);
    console.log('amount', users.length);
    res.status(201).json({ message: 'File readed', statusCode: res.statusCode });
  } catch (err) {
    next();
  }
});

module.exports = router;
