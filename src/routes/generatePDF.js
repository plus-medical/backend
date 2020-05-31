const express = require('express');
const sendPDF = require('../utils/functions/sendPDF');

const router = express.Router();

router.get('/', async (req, res) => {
  const title = 'This is a test';
  const text = 'Some of text here';
  const pdf = {
    title,
    text,
  };
  sendPDF(res, pdf);
});

module.exports = router;
